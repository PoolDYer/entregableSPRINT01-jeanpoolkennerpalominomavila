param(
    [string]$ArchifyCli = (Join-Path $env:TEMP 'sifitur-diagram-tools/archify/archify/bin/archify.mjs'),
    [string]$StructurizrWar = (Join-Path $env:TEMP 'sifitur-diagram-tools/structurizr.war'),
    [string]$PlantUmlJar = (Join-Path $env:TEMP 'sifitur-diagram-tools/plantuml.jar'),
    [string]$PlaywrightModule = (Join-Path $env:TEMP 'sifitur-diagram-tools/browser/node_modules/playwright/index.mjs')
)
$ErrorActionPreference = 'Stop'
Set-Location (Split-Path -Parent $PSScriptRoot)
foreach ($toolPath in @($ArchifyCli, $StructurizrWar, $PlantUmlJar, $PlaywrightModule)) {
    if (-not (Test-Path -LiteralPath $toolPath -PathType Leaf)) { throw "Herramienta no encontrada: $toolPath. Ver diagrams/README.md." }
}
$buildId = 'build-' + (Get-Date -Format 'yyyyMMdd-HHmmss')
$manifest = Get-Content -LiteralPath 'diagrams/archify-manifest.json' -Raw | ConvertFrom-Json
foreach ($diagram in $manifest) {
    & node $ArchifyCli finalize $diagram.type $diagram.input $diagram.output --repo-root . --quality showcase --out-dir (Join-Path (Split-Path $diagram.input) $buildId) --json
    if ($LASTEXITCODE -ne 0) { throw "Falló Archify: $($diagram.slug)" }
}
$env:PLAYWRIGHT_MODULE = $PlaywrightModule
& node scripts/exportar-archify.mjs
if ($LASTEXITCODE -ne 0) { throw 'Falló la exportación Archify.' }
$umlFiles = Get-ChildItem -LiteralPath diagrams/structurizr -Filter '*.puml' | Select-Object -ExpandProperty FullName
& java -jar $PlantUmlJar -tsvg -charset UTF-8 @umlFiles
if ($LASTEXITCODE -ne 0) { throw 'Falló PlantUML.' }
& java -jar $StructurizrWar validate -w diagrams/structurizr/workspace.dsl
if ($LASTEXITCODE -ne 0) { throw 'Modelo Structurizr inválido.' }
& java -jar $StructurizrWar export -w diagrams/structurizr/workspace.dsl -f json -o diagrams/structurizr/modelo
if ($LASTEXITCODE -ne 0) { throw 'Falló compilación JSON de Structurizr.' }
& node scripts/organizar-nivel2-structurizr.mjs
if ($LASTEXITCODE -ne 0) { throw 'Falló distribución manual del nivel 2.' }
& node scripts/organizar-nivel3-structurizr.mjs
if ($LASTEXITCODE -ne 0) { throw 'Falló distribución manual del nivel 3.' }
foreach ($format in @('static', 'svg', 'png')) {
    $destination = if ($format -eq 'static') { 'diagrams/structurizr/site' } else { 'diagrams/structurizr/export' }
    & java -jar $StructurizrWar export -w diagrams/structurizr/modelo/workspace.json -f $format -o $destination
    if ($LASTEXITCODE -ne 0) { throw "Falló exportación Structurizr: $format" }
}
foreach ($name in @('nivel1-contexto','nivel2-contenedores','nivel3-componentes','nivel4-clases','nivel4-registro','nivel4-secuencia','nivel4-agregado')) {
    Copy-Item -LiteralPath "diagrams/structurizr/export/$name.svg" -Destination "img/fuentes-svg/$name.svg"
    Copy-Item -LiteralPath "diagrams/structurizr/export/$name.png" -Destination "img/$name.png"
}
& "$PSScriptRoot/exportar-jpg-structurizr.ps1"
& node scripts/actualizar-catalogo-diagramas.mjs
if ($LASTEXITCODE -ne 0) { throw 'Falló actualización del catálogo.' }
