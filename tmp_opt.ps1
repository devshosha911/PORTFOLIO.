Add-Type -AssemblyName System.Drawing
$max=1280
$q=70
$files = 'cassino.png','Futuristic.png','cloud.png','mobileapp.png','platform.png'
foreach($f in $files){
    $path = Join-Path '.' $f
    if(!(Test-Path $path)){Write-Host "skip $f"; continue}
    $img=[System.Drawing.Image]::FromFile($path)
    $w=$img.Width; $h=$img.Height
    if($w -le $max -and $h -le $max){$newW=$w;$newH=$h}
    elseif($w -ge $h){$newW=$max; $newH=[int]([double]$h*$max/$w)}
    else {$newH=$max; $newW=[int]([double]$w*$max/$h)}
    $bmp = New-Object System.Drawing.Bitmap($newW,$newH)
    $g=[System.Drawing.Graphics]::FromImage($bmp)
    $g.CompositingQuality='HighQuality'
    $g.SmoothingMode='HighQuality'
    $g.InterpolationMode='HighQualityBicubic'
    $g.DrawImage($img,0,0,$newW,$newH)
    $g.Dispose()
    $enc=[System.Drawing.Imaging.ImageCodecInfo]::GetImageEncoders() | Where-Object {$_.MimeType -eq 'image/jpeg'}
    $ep = New-Object System.Drawing.Imaging.EncoderParameters 1
    $ep.Param[0] = New-Object System.Drawing.Imaging.EncoderParameter ([System.Drawing.Imaging.Encoder]::Quality), $q
    $out = [System.IO.Path]::ChangeExtension($path,'_opt.jpg')
    $bmp.Save($out,$enc,$ep)
    $bmp.Dispose(); $img.Dispose()
    Write-Host ("done {0} ({1}x{2})" -f $out,$newW,$newH)
}
