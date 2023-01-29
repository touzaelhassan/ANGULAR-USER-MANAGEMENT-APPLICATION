pipeline {
    agent any
    triggers {
       pollSCM '* * * * *'
    }
    stages {
        stage('Deploy') {
            steps {
                bat 'docker-compose build'
                bat 'docker-compose up -d'
            }
        }
    }
}