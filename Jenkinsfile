pipeline {
    agent {
        docker {
          image 'node:20'
        }
    }

    environment {
        NODE_ENV = 'test'
        MONGO_URI = credentials('test-mongo-uri')
        JWT_SECRET = credentials('test-jwt-secret')
    }

    stages {
      stage('Checkout') {
          steps {
            checkout scm
          }
      }

      stage('Install Dependencies') {
          steps {
            sh 'npm ci'
          }
      }

      stage('Run Unit Tests') {
          steps {
            sh 'npm run test:unit'
          }
      }

      stage('Run Integration Tests') {
          steps {
            sh 'npm run test:integration'
          }
      }

      stage('Build') {
          steps {
            sh 'npm run build'
          }
      }
    }

    post {
        always {
          junit 'reports/*.xml'
        }
        success {
          echo '✅ Tudo certo, pipeline passou'
        }
        failure {
          echo '❌ Pipeline quebrou'
        }
    }
}
