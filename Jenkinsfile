pipeline {
    agent {
        label 'agent1'
    }

    environment{
        DOCKERHUB_CREDENTIALS=credentials('dockerhub')
    }

    stages {
        stage('gitclone'){
            steps {
               git 'https://github.com/manvimandar/jenkins-node-login.git'
        }

        stage('build'){
            steps {
                sh 'docker build -t mandarr/node-login:1.2.0 .'
            }
        }

        stage ('login'){
            sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
        }

        stage ('push') {
            steps {
                sh 'docker push mandarr/node-login:1.2.0'
            }
        }
    }

    post {
        always {
            sh 'docker logout'
        }
    }
}