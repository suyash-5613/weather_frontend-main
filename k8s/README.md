# Kubernetes Deployment for Weather Frontend

This directory contains Kubernetes manifests to deploy the weather frontend application.

## Prerequisites

- Kubernetes cluster (minikube, Docker Desktop, or cloud provider)
- kubectl configured to access your cluster
- Docker image available at `suyash0405/weather_frontend:latest`

## Files

- `namespace.yaml` - Creates the `weather-app` namespace
- `frontend-deployment.yaml` - Deployment with 2 replicas of the frontend
- `frontend-service.yaml` - LoadBalancer service to expose the frontend

## Deployment Steps

### 1. Apply all manifests

```powershell
kubectl apply -f k8s/namespace.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/frontend-service.yaml
```

Or apply all at once:

```powershell
kubectl apply -f k8s/
```

### 2. Verify deployment

Check if pods are running:

```powershell
kubectl get pods -n weather-app
```

Check service status:

```powershell
kubectl get svc -n weather-app
```

### 3. Access the application

**For Minikube:**

```powershell
minikube service weather-frontend -n weather-app
```

**For Docker Desktop or cloud providers:**

Get the external IP:

```powershell
kubectl get svc weather-frontend -n weather-app
```

Wait for the `EXTERNAL-IP` to be assigned, then access via `http://<EXTERNAL-IP>`

**For NodePort access (if LoadBalancer not available):**

Edit `frontend-service.yaml` and change `type: LoadBalancer` to `type: NodePort`, then:

```powershell
kubectl get svc weather-frontend -n weather-app
```

Access via `http://<NODE-IP>:<NODE-PORT>`

### 4. View logs

```powershell
kubectl logs -f deployment/weather-frontend -n weather-app
```

### 5. Scale the deployment

```powershell
kubectl scale deployment weather-frontend --replicas=3 -n weather-app
```

## Cleanup

Remove all resources:

```powershell
kubectl delete -f k8s/
```

Or delete the namespace (removes everything):

```powershell
kubectl delete namespace weather-app
```

## Notes

- The deployment uses 2 replicas for high availability
- Resource limits are set to prevent excessive resource consumption
- Health probes ensure pods are healthy before receiving traffic
- The service uses LoadBalancer type for external access (works with cloud providers and Docker Desktop)
- For production, consider using Ingress instead of LoadBalancer for better routing and SSL termination
