pipeline {
    agent any
    stages {
        stage('Git Clone'){
            steps {
                git credentialsId: 'github-private-key', url: 'git@github.com:manvimandar/jenkins-node-login.git'            }
        }
        stage('Create DockerImage'){
            steps {
                sh 'docker build -t mandarr/node-login:1.1.0 .'
            }
        }
    }
}