pipeline {
    agent any

    tools {
        nodejs 'node22'
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

      stage('Start Application') {
          steps {
            sh 'nohup npm start &'
            sh 'sleep 5'
          }
      }

      stage('Wait for API') {
        steps {
            sh 'sleep 5'
            sh 'curl -f http://localhost:3000/tasks || exit 1'
        }
      }
    }

    post {
        always {
          junit 'reports/*.xml'
          sh "pkill -f node || true"
        }
        success {
          echo '✅ Tudo certo, pipeline passou'
        }
        failure {
          echo '❌ Pipeline quebrou'
        }
    }
}
