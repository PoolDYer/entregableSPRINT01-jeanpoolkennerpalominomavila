param([int]$Quality = 95)
$ErrorActionPreference = 'Stop'
if ($Quality -lt 1 -or $Quality -gt 100) { throw 'La calidad JPEG debe estar entre 1 y 100.' }
Add-Type -AssemblyName System.Drawing
$jpegEncoder = [System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object MimeType -eq 'image/jpeg'
$encoderParameters = [System.Drawing.Imaging.EncoderParameters]::new(1)
$encoderParameters.Param[0] = [System.Drawing.Imaging.EncoderParameter]::new([System.Drawing.Imaging.Encoder]::Quality, [long]$Quality)
try {
    foreach ($name in @('nivel1-contexto','nivel2-contenedores','componentes','nivel3-componentes','nivel4-clases','nivel4-registro','nivel4-secuencia','nivel4-agregado')) {
        $sourcePath = Join-Path $PSScriptRoot "../img/$name.png"
        $targetPath = [IO.Path]::GetFullPath((Join-Path $PSScriptRoot "../img/$name.jpg"))
        $source = [System.Drawing.Image]::FromFile([IO.Path]::GetFullPath($sourcePath))
        $bitmap = [System.Drawing.Bitmap]::new($source.Width, $source.Height, [System.Drawing.Imaging.PixelFormat]::Format24bppRgb)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        try {
            $graphics.Clear([System.Drawing.Color]::White)
            $graphics.DrawImageUnscaled($source, 0, 0)
            $bitmap.Save($targetPath, $jpegEncoder, $encoderParameters)
            Write-Output "JPG Structurizr: $name"
        } finally {
            $graphics.Dispose()
            $bitmap.Dispose()
            $source.Dispose()
        }
    }
} finally { $encoderParameters.Dispose() }
