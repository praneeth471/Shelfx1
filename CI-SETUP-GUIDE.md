# ShelfX CI Pipeline Setup Guide

## Overview

This guide explains how to use the GitHub Actions CI pipeline that has been set up for your ShelfX application. The pipeline automates testing, building, and deploying your application whenever code is pushed to the repository.

## What's Included

1. **Continuous Integration Workflow** (`.github/workflows/ci.yml`)
   - Automatically runs on pushes to dev branch and pull requests
   - Tests and builds your application
   - Creates Docker images for both frontend and backend
   - Prepares for deployment (can be configured as needed)

2. **Docker Configuration**
   - Frontend Dockerfile for building the React application
   - Backend Dockerfile (already existing in your project)
   - Docker Compose setup (already existing in your project)

## Getting Started

### 1. Push the CI Configuration to GitHub

Make sure to push the `.github` directory to your GitHub repository:

```bash
git add .github
git commit -m "Add CI pipeline configuration"
git push
```

### 2. Configure GitHub Secrets

To enable Docker image building and pushing, add these secrets in your GitHub repository:

1. Go to your GitHub repository → Settings → Secrets and variables → Actions
2. Add the following secrets:
   - `DOCKER_USERNAME`: Your DockerHub username
   - `DOCKER_PASSWORD`: Your DockerHub password or access token

### 3. Monitor CI Pipeline Runs

1. Go to the "Actions" tab in your GitHub repository
2. You'll see workflow runs for each push and pull request
3. Click on any run to see detailed logs and results

## Customizing the Pipeline

### Adding Tests

The pipeline is ready to run tests when you add them to your project:

1. Open `.github/workflows/ci.yml`
2. Find the "Run tests" step
3. Replace the placeholder with your actual test command

### Configuring Deployment

The pipeline includes a commented-out deployment job that you can configure:

1. Open `.github/workflows/ci.yml`
2. Uncomment the "deploy" job
3. Add your deployment steps based on your hosting provider

## Troubleshooting

If your CI pipeline fails:

1. Check the GitHub Actions logs for specific error messages
2. Verify that your code builds and runs locally
3. Ensure all required secrets are properly configured
4. Check that your Docker configuration is correct

## Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Docker Documentation](https://docs.docker.com/)
- [Node.js CI Best Practices](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)