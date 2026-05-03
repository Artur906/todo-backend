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
            sh 'nohup npm start & echo $! > app.pid && sleep 5'
          }
      }
    }

    post {
        always {
          junit 'reports/*.xml'
          sh '''
          if [ -f app.pid ]; then
              kill $(cat app.pid) || true
          fi
          '''
        }
        success {
          echo '✅ Tudo certo, pipeline passou'
        }
        failure {
          echo '❌ Pipeline quebrou'
        }
    }
}
