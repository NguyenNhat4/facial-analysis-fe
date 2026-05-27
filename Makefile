SHELL := /bin/sh

DOCKERHUB_USERNAME ?= nguyennhat4
IMAGE_NAME ?= dental-ai-ui
IMAGE := $(DOCKERHUB_USERNAME)/$(IMAGE_NAME):v1.0.0

KUBE_NAMESPACE ?= default
KUBE_DEPLOYMENT ?= deployment-1
KUBE_DEPLOYMENT_SERVICE ?= dental-app-service
CONTAINER_NAME ?= nginx-1
LABEL=deployment-1

COMPOSE_FILE ?= docker-compose.yml
COMPOSE_SERVICE ?= dental-ai-ui

.PHONY: help build push build-push release compose-build compose-push compose-release deploy-gke rollout-status login connect-GKE-project

help:
	@echo "Targets:"
	@echo "  make build            Build Docker image as $(IMAGE)"
	@echo "  make push             Push Docker image to Docker Hub"
	@echo "  make build-push       Build and push in one step"
	@echo "  make release          Build, push, update GKE, and wait for rollout"
	@echo "  make compose-build    Build the image with Docker Compose"
	@echo "  make compose-push     Push the Compose image to Docker Hub"
	@echo "  make compose-release  Build, push, update GKE, and wait for rollout using Compose"
	@echo "  make deploy-gke       Update GKE Deployment to the new image"
	@echo "  make rollout-status   Watch the GKE rollout until it finishes"
	@echo "  make login            Login to Docker Hub interactively"

login:
	docker login

build:
	docker build -t $(IMAGE) .

push:
	docker push $(IMAGE)

build-push: build push
set-image: 
	kubectl set image deployment/$(KUBE_DEPLOYMENT) $(CONTAINER_NAME)=$(IMAGE) --namespace default


release: build-push deploy-gke rollout-status

compose-build:
	docker compose  build

compose-push:
	docker compose push

include .env

connect-GKE-project:
	gcloud container clusters get-credentials $(GKE_CLUSTER_NAME) \
		--region $(GKE_REGION) \
		--project $(GCP_PROJECT_ID)

compose-release: compose-build compose-push connect-GKE-project restart-deployment

restart-deployment:
	kubectl rollout restart deployment/$(KUBE_DEPLOYMENT) -n default

rollout-status:
	kubectl rollout status deployment/$(KUBE_DEPLOYMENT) -n $(KUBE_NAMESPACE)
get-ip:
	@kubectl get service $(KUBE_DEPLOYMENT_SERVICE) -o jsonpath='{.status.loadBalancer.ingress[0].ip}'

create-loadbalancer:
	kubectl expose deployment $(KUBE_DEPLOYMENT) --type=LoadBalancer --name=$(KUBE_DEPLOYMENT_SERVICE) --port=80 --target-port=4173	