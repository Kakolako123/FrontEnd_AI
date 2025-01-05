pipeline {
    agent any
    environment {
        VERCEL_TOKEN = credentials('vercel-token')
        NPM_PATH = 'C:\\ProgramData\\Jenkins\\.jenkins\\npm'
    }
    stages {
        stage('Vercel Deploy') {
            steps {
                script {
                    try {
                        // Installation Vercel
                        bat 'npm install -g vercel'

                        // Déploiement
                        bat """
                            cd %WORKSPACE%
                            "${NPM_PATH}\\vercel.cmd" deploy --token %VERCEL_TOKEN% --prod --confirm > vercel_output.txt

                            echo "=== Sortie du déploiement ==="
                            type vercel_output.txt

                            echo "=== Recherche URL ==="
                            findstr /C:"Production:" vercel_output.txt > url.txt

                            echo "=== URL trouvée ==="
                            type url.txt
                        """

                        // Vérification et archivage
                        if (fileExists('url.txt')) {
                            def deployUrl = readFile('url.txt').trim()
                            echo "URL de déploiement: ${deployUrl}"
                            archiveArtifacts artifacts: '**/url.txt,**/vercel_output.txt', allowEmptyArchive: true
                        } else {
                            error "Échec de la capture de l'URL"
                        }
                    } catch (Exception e) {
                        error "Erreur de déploiement: ${e.message}"
                    }
                }
            }
        }
    }
}