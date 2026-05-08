pipeline {
    agent any
    environment {
        APP_REPO_URL   = 'https://github.com/MeghanMoiraLanning014/DevOpsAssignment3.git'
        TEST_REPO_URL  = 'https://github.com/MeghanMoiraLanning014/ColorPalette-Tests.git'
    }
    stages {
        stage('Checkout App Code') {
            steps { git branch: 'main', url: "${APP_REPO_URL}" }
        }
        stage('Prepare Environment') {
            steps {
                sh '''
                echo "MONGODB_URI=mongodb://db:27017/colorpalette" > .env
                echo "COOKIE_DOMAIN=localhost" >> .env
                echo "NODE_ENV=production" >> .env
                echo "JWT_SECRET=45e269616244b956ae28e61bd633899d" >> .env
                echo "PORT=4000" >> .env
                '''
            }
        }
        stage('Clean') {
            steps { sh 'docker compose -f docker-compose.ci.yml down || true' }
        }
        stage('Build & Deploy') {
            steps {
                sh 'docker compose -p colorpalette -f docker-compose.ci.yml up -d'
                sh 'sleep 60'
            }
        }
    }
}
