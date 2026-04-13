try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Add()
    $selection = $word.Selection
    
    $selection.Font.Name = "Consolas"
    $selection.Font.Size = 14
    $selection.Font.Bold = 1
    $selection.TypeText("docker-compose.yml (Part II)")
    $selection.TypeParagraph()
    $selection.Font.Bold = 0
    $selection.Font.Size = 11
    
    $text1 = Get-Content -Path "C:\Users\Administrator\Desktop\Color-Generator\docker-compose.ci.yml" -Raw
    $selection.TypeText($text1)
    $selection.TypeParagraph()
    $selection.TypeParagraph()
    
    $selection.Font.Name = "Consolas"
    $selection.Font.Size = 14
    $selection.Font.Bold = 1
    $selection.TypeText("Jenkinsfile (Part II)")
    $selection.TypeParagraph()
    $selection.Font.Bold = 0
    $selection.Font.Size = 11

    $text2 = Get-Content -Path "C:\Users\Administrator\Desktop\Color-Generator\JenkinsFile" -Raw
    $selection.TypeText($text2)
    
    $doc.SaveAs([ref]"C:\Users\Administrator\Desktop\Part2_Jenkins_DockerCompose.docx")
    $doc.Close([ref]$false)
    $word.Quit()
    Write-Output "Word COM object succeeded. Document saved to Desktop as Part2_Jenkins_DockerCompose.docx"
} catch {
    Write-Output "Word COM object failed. Error: $_"
}
