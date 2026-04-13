try {
    $word = New-Object -ComObject Word.Application
    $word.Visible = $false
    $doc = $word.Documents.Add()
    $selection = $word.Selection
    
    $selection.Font.Name = "Consolas"
    $selection.Font.Size = 14
    $selection.Font.Bold = 1
    $selection.TypeText("Dockerfile")
    $selection.TypeParagraph()
    $selection.Font.Bold = 0
    $selection.Font.Size = 11
    
    $text1 = @"
FROM node:18-alpine
RUN apk add --no-cache python3 make g++ krb5-dev
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
RUN npm install next@15.2.4 --legacy-peer-deps
RUN npx next --version
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "start"]
"@
    $selection.TypeText($text1)
    $selection.TypeParagraph()
    $selection.TypeParagraph()
    
    $selection.Font.Name = "Consolas"
    $selection.Font.Size = 14
    $selection.Font.Bold = 1
    $selection.TypeText("docker-compose.yml")
    $selection.TypeParagraph()
    $selection.Font.Bold = 0
    $selection.Font.Size = 11

    $text2 = @"
version: '3.8'

services:
  web:
    build: .
    container_name: color-palette-web-ci
    ports:
      - "5000:3000"
    env_file:
      - .env
    depends_on:
      - db
    command: npm run start

  db:
    image: mongo:latest
    container_name: color-palette-db
    ports:
      - "27017:27017"
    volumes:
      - db_data:/data/db

volumes:
  db_data:
"@
    $selection.TypeText($text2)
    
    $doc.SaveAs([ref]"C:\Users\Administrator\Desktop\Docker_and_Compose.docx")
    $doc.Close([ref]$false)
    $word.Quit()
    Write-Output "Word COM object succeeded."
} catch {
    Write-Output "Word COM object failed. Error: $_"
}
