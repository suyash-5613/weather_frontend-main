# Ansible Automation for Weather Frontend

This directory contains Ansible playbooks to automate building, pushing, and deploying the weather frontend application.

## Prerequisites

### 1. Install Ansible

**Windows (via pip):**
```powershell
pip install ansible
```

**Or via WSL/Linux:**
```bash
sudo apt update
sudo apt install ansible -y
```

### 2. Install Required Ansible Collections

```powershell
ansible-galaxy collection install -r requirements.yml
```

### 3. Install Python Dependencies

```powershell
pip install kubernetes docker
```

## Playbooks

### 1. `deploy-k8s.yml` - Deploy to Kubernetes
Deploys the weather frontend application to Kubernetes cluster.

**Usage:**
```powershell
ansible-playbook ansible/deploy-k8s.yml
```

**What it does:**
- Checks if kubectl and cluster are accessible
- Creates namespace `weather-app`
- Deploys frontend with 2 replicas
- Creates LoadBalancer service
- Displays deployment info and access URL

### 2. `build-and-push.yml` - Build and Push Docker Image
Builds the Docker image and pushes it to Docker Hub.

**Usage:**
```powershell
ansible-playbook ansible/build-and-push.yml
```

**What it does:**
- Checks if Docker is installed and running
- Builds Docker image from Dockerfile
- Tags image with latest and git commit SHA
- Prompts for Docker Hub credentials
- Pushes image to Docker Hub

### 3. `full-deploy.yml` - Complete CI/CD Pipeline
Runs both build and deployment in sequence.

**Usage:**
```powershell
ansible-playbook ansible/full-deploy.yml
```

### 4. `cleanup.yml` - Remove All Resources
Deletes the entire namespace and all deployed resources.

**Usage:**
```powershell
ansible-playbook ansible/cleanup.yml
```

## Configuration

### Inventory File (`inventory.ini`)
Defines the target hosts. Currently set to localhost.

### Variables

You can override variables using `-e` flag:

```powershell
ansible-playbook ansible/deploy-k8s.yml -e "replicas=3 docker_tag=v1.0.0"
```

**Common variables:**
- `docker_username` - Docker Hub username (default: suyash0405)
- `docker_image_name` - Docker image name (default: weather_frontend)
- `docker_tag` - Docker image tag (default: latest)
- `namespace` - Kubernetes namespace (default: weather-app)
- `replicas` - Number of pod replicas (default: 2)
- `service_type` - Service type (default: LoadBalancer)

## Examples

### Deploy to Kubernetes with 3 replicas
```powershell
ansible-playbook ansible/deploy-k8s.yml -e "replicas=3"
```

### Build and tag with custom version
```powershell
ansible-playbook ansible/build-and-push.yml -e "docker_tag=v2.0.0"
```

### Deploy with NodePort instead of LoadBalancer
```powershell
ansible-playbook ansible/deploy-k8s.yml -e "service_type=NodePort"
```

### Full deployment with custom settings
```powershell
ansible-playbook ansible/full-deploy.yml -e "replicas=3 docker_tag=production"
```

### Cleanup everything
```powershell
ansible-playbook ansible/cleanup.yml
```

## Dry Run

Test playbooks without making changes:
```powershell
ansible-playbook ansible/deploy-k8s.yml --check
```

## Verbose Output

Run with verbose mode for debugging:
```powershell
ansible-playbook ansible/deploy-k8s.yml -v
# or -vv, -vvv for more verbosity
```

## Troubleshooting

### Error: "kubectl is not installed"
Install kubectl: `choco install kubernetes-cli` (Windows) or follow official docs

### Error: "Cannot connect to Kubernetes cluster"
Start minikube: `minikube start`

### Error: "Docker daemon is not running"
Start Docker Desktop

### Error: "Collection kubernetes.core not found"
Install collections: `ansible-galaxy collection install -r requirements.yml`

## CI/CD Integration

You can integrate these playbooks into GitHub Actions:

```yaml
- name: Run Ansible deployment
  run: |
    pip install ansible kubernetes docker
    ansible-galaxy collection install -r ansible/requirements.yml
    ansible-playbook ansible/deploy-k8s.yml
```

## Notes

- The playbooks use `localhost` connection for local execution
- Docker credentials are prompted interactively (not stored)
- For production, use Ansible Vault for sensitive data
- Health probes ensure pods are ready before receiving traffic
- Resource limits prevent excessive consumption
