<#
  Generates the Open Graph cover (1200x630) for lsalasdeveloper.me.

  Composition: dark "Stack" landing capture as background + branded text panel
  with name, stack and site URL. Output is written to public/images/og-image.png
  so it ships with the build and can be referenced by the og:image meta tag.

  Usage: powershell -File scripts/generate-og-image.ps1
#>
[CmdletBinding()]
param(
  [string]$SourcePath,
  [string]$OutputPath,
  [string]$SiteUrl = 'lsalasdeveloper.me',
  [int]$SourceCropBottom = 146
)

Add-Type -AssemblyName System.Drawing

# $PSScriptRoot is not reliable inside the param block, so resolve paths here
$scriptDirectory = Split-Path -Parent $MyInvocation.MyCommand.Path
if ([string]::IsNullOrWhiteSpace($SourcePath)) {
  $SourcePath = Join-Path $scriptDirectory '..\captures-linkedin\portfolio\4_landing_page.png'
}
if ([string]::IsNullOrWhiteSpace($OutputPath)) {
  $OutputPath = Join-Path $scriptDirectory '..\public\images\og-image.png'
}

$canvasWidth = 1200
$canvasHeight = 630

# Brand palette (mirrors the site neon theme)
$colorCanvas = [System.Drawing.Color]::FromArgb(255, 8, 8, 11)
$colorPink = [System.Drawing.Color]::FromArgb(255, 217, 70, 239)
$colorWhite = [System.Drawing.Color]::FromArgb(255, 248, 250, 252)
$colorMuted = [System.Drawing.Color]::FromArgb(255, 148, 163, 184)
$colorBorder = [System.Drawing.Color]::FromArgb(255, 39, 39, 42)

function New-RoundedPath {
  param(
    [System.Drawing.RectangleF]$Rect,
    [float]$Radius
  )
  $path = New-Object System.Drawing.Drawing2D.GraphicsPath
  $diameter = $Radius * 2
  $path.AddArc($Rect.X, $Rect.Y, $diameter, $diameter, 180, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Y, $diameter, $diameter, 270, 90)
  $path.AddArc($Rect.Right - $diameter, $Rect.Bottom - $diameter, $diameter, $diameter, 0, 90)
  $path.AddArc($Rect.X, $Rect.Bottom - $diameter, $diameter, $diameter, 90, 90)
  $path.CloseFigure()
  return $path
}

if (-not (Test-Path -LiteralPath $SourcePath)) {
  throw "Source capture not found: $SourcePath"
}

$outputDirectory = Split-Path -Parent $OutputPath
if (-not (Test-Path -LiteralPath $outputDirectory)) {
  New-Item -ItemType Directory -Path $outputDirectory -Force | Out-Null
}

$bitmap = New-Object System.Drawing.Bitmap($canvasWidth, $canvasHeight)
$bitmap.SetResolution(96, 96)
$graphics = [System.Drawing.Graphics]::FromImage($bitmap)
$graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
$graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
$graphics.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::ClearTypeGridFit

$graphics.Clear($colorCanvas)

# 1) Background capture, center-cropped to fill the canvas ("cover" fit).
# The bottom strip is trimmed to hide the floating chat widget from the capture.
$source = [System.Drawing.Image]::FromFile((Resolve-Path -LiteralPath $SourcePath).Path)
try {
  $cropHeight = [Math]::Max(1, $source.Height - $SourceCropBottom)
  $scale = [Math]::Max($canvasWidth / $source.Width, $canvasHeight / $cropHeight)
  $sourceWidth = [single]($canvasWidth / $scale)
  $sourceHeight = [single]($canvasHeight / $scale)
  $sourceX = [single](($source.Width - $sourceWidth) / 2)
  $sourceY = [single](($cropHeight - $sourceHeight) / 2)

  $destRect = New-Object System.Drawing.Rectangle(0, 0, $canvasWidth, $canvasHeight)
  $graphics.DrawImage(
    $source,
    $destRect,
    $sourceX,
    $sourceY,
    $sourceWidth,
    $sourceHeight,
    [System.Drawing.GraphicsUnit]::Pixel
  )
}
finally {
  $source.Dispose()
}

# 2) Darkening layers so the text stays readable on top of the capture
$dimBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(110, 8, 8, 11))
$graphics.FillRectangle($dimBrush, 0, 0, $canvasWidth, $canvasHeight)
$dimBrush.Dispose()

$gradientRect = New-Object System.Drawing.Rectangle(0, 0, 720, $canvasHeight)
$gradientBrush = New-Object System.Drawing.Drawing2D.LinearGradientBrush(
  $gradientRect,
  [System.Drawing.Color]::FromArgb(235, 8, 8, 11),
  [System.Drawing.Color]::FromArgb(0, 8, 8, 11),
  [System.Drawing.Drawing2D.LinearGradientMode]::Horizontal
)
$graphics.FillRectangle($gradientBrush, 0, 0, 720, $canvasHeight)
$gradientBrush.Dispose()

# 3) Branded panel with the copy that identifies the profile
$panelRect = New-Object System.Drawing.RectangleF(72, 150, 620, 320)
$panelPath = New-RoundedPath -Rect $panelRect -Radius 22

$panelBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(247, 10, 10, 14))
$graphics.FillPath($panelBrush, $panelPath)
$panelBrush.Dispose()

$panelPen = New-Object System.Drawing.Pen($colorBorder, 1)
$graphics.DrawPath($panelPen, $panelPath)
$panelPen.Dispose()

$accentRect = New-Object System.Drawing.RectangleF(74, 192, 4, 236)
$accentBrush = New-Object System.Drawing.SolidBrush($colorPink)
$graphics.FillRectangle($accentBrush, $accentRect)
$accentBrush.Dispose()

# 4) Typography
$textX = 112
# Built at runtime so the script stays ASCII-only (Windows PowerShell 5.1 reads .ps1 as ANSI)
$separator = ' ' + [char]0x00B7 + ' '

$kickerFont = New-Object System.Drawing.Font('Cascadia Mono', 17, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$nameFont = New-Object System.Drawing.Font('Cascadia Mono', 56, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
$stackFont = New-Object System.Drawing.Font('Cascadia Mono', 18, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
$urlFont = New-Object System.Drawing.Font('Cascadia Mono', 24, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)

$pinkBrush = New-Object System.Drawing.SolidBrush($colorPink)
$whiteBrush = New-Object System.Drawing.SolidBrush($colorWhite)
$mutedBrush = New-Object System.Drawing.SolidBrush($colorMuted)

$searchLine = 'Vue.js' + $separator + 'React' + $separator + 'Next.js' + $separator + 'TypeScript'
$keywordsLine = 'Laravel' + $separator + 'Node.js' + $separator + 'IA aplicada (RAG, LLMs)'

$graphics.DrawString('// FRONTEND & FULLSTACK DEVELOPER', $kickerFont, $pinkBrush, [single]$textX, [single]190)
$graphics.DrawString('Lorena Salas', $nameFont, $whiteBrush, [single]$textX, [single]218)
$graphics.DrawString($searchLine, $stackFont, $mutedBrush, [single]$textX, [single]302)
$graphics.DrawString($keywordsLine, $stackFont, $mutedBrush, [single]$textX, [single]330)

$dividerPen = New-Object System.Drawing.Pen($colorBorder, 1)
$graphics.DrawLine($dividerPen, [single]$textX, [single]380, [single]652, [single]380)
$dividerPen.Dispose()

$graphics.DrawString($SiteUrl, $urlFont, $whiteBrush, [single]$textX, [single]400)

$pinkBrush.Dispose()
$whiteBrush.Dispose()
$mutedBrush.Dispose()
$kickerFont.Dispose()
$nameFont.Dispose()
$stackFont.Dispose()
$urlFont.Dispose()
$panelPath.Dispose()
$graphics.Dispose()

$bitmap.Save($OutputPath, [System.Drawing.Imaging.ImageFormat]::Png)
$bitmap.Dispose()

Write-Output "OG image generated: $OutputPath ($canvasWidth x $canvasHeight)"

