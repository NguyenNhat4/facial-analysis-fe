SHELL := /bin/sh

DOCKERHUB_USERNAME ?= nguyennhat4
IMAGE_NAME ?= dental-ai-ui
IMAGE := $(DOCKERHUB_USERNAME)/$(IMAGE_NAME)

KUBE_NAMESPACE ?= default
KUBE_DEPLOYMENT ?= dental-app
CONTAINER_NAME ?= dental-ai-ui-1
LABEL=a

COMPOSE_FILE ?= docker-compose.yml
COMPOSE_SERVICE ?= dental-ai-ui

.PHONY: help build push build-push release compose-build compose-push compose-release deploy-gke rollout-status login

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

release: build-push deploy-gke rollout-status

compose-build:
	docker compose -f $(COMPOSE_FILE) build $(COMPOSE_SERVICE)

compose-push:
	docker compose -f $(COMPOSE_FILE) push $(COMPOSE_SERVICE)
include .env
connect-GKE-project: 
	gcloud container clusters get-credentials $(GKE_CLUSTER_NAME)
	 	--region $(GKE_REGION)
		--project $(GCP_PROJECT_ID)
compose-release: compose-build compose-push connect-GKE-project deploy-gke rollout-status

deploy-gke:
	kubectl set image deployment/$(KUBE_DEPLOYMENT) \
		$(CONTAINER_NAME)=$(IMAGE) 

rollout-status:
	kubectl rollout status deployment/$(KUBE_DEPLOYMENT) -n $(KUBE_NAMESPACE)
