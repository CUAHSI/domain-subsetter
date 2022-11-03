# Design: Model Domain Subsetter

**Version**: 2.0  
**Author:** Tony Castronova  

## Contents

1. [Overview](#1.-overview)  
2. [Goals](#1.2-goals)  
3. [Design Considerations](#3.3.-design-considerations)  
3.1 [Vanilla](#3.1-vanilla)  
3.2 [Native Kubernetes](#3.2-native-kubernetes)  
3.3 [Kubernetes Microservices](#3.3-kubernetes-microservices-knative)  
<!--
4. [Proposed Design](#4.-proposed-design)  
4.1 [Features](#4.1-features)  
4.2 [Constraints](#4.2-constraints)  
4.4 [Technical Approach](#4.4-technical-details)  
4.4.1 [Front-End](#4.4.1-front-end)  
4.4.2 [Back-End](#4.4.2-back-end)  
4.4.3 [Communication Line](#4.4.3-communication-line)  
4.4.4 [Queue](#4.4.4-queue)  
4.4.5 [Workers](#4.4.5-workers)  
-->

## 1. Overview

The current architecture implements  a producer-consumer pattern, where some work is produced by a producer and completed by some consumer. More concretely, in our case, it consists of a front-end web interface that receives job requests, produces some work,and passes that work  to a pool of consumers (workers). The code, data, and dependencies required to execute  jobs are pre-installed on the system; as such, workers run code existing on the system parameterized by job requirements. Once a job is complete, the resulting payload is downloaded via the front-end web-ui. There are several disadvantages to the current implementation, specifically:

- A growth in job types increases the number of dependencies installed on the system. This increases the likelihood of dependency versioning issues.

- Large VMs are necessary to support the wide-range of job requirements, e.g. computational requirements such as RAM, CPU, etc. This will become cost prohibitive as the service expands in the future.

- Adding new jobs requires modifying the front-end UI.

- The architecture is highly coupled and difficult to test locally, any addition of job types magnifies this issue.

In late 2021, this service was migrated from CUAHSI-hosted servers to the commercial cloud (i.e. GCP). During this process, the service was "dockerized" for ease of deployment however few other changes were made. To minimize cloud hosting cost, the service is currently hosted on a moderate sized VM. However, this is not a cost efficient nor scalable solution. **The primary goal of the proposed work is to modify the underlying software architecture to make this service more cost effective and resilient moving forward**. In doing so we will update web frameworks and libraries as necessary and include additional UX-focused features. 

## 2. Goals

- Update the underlying architecture to leverage commercial cloud services to minimize cost and improve scalability.

- Implement UI improvements for selecting regions of interest.

- De-couple with front-end, back-end, and database components of the current architecture.

- Execute jobs separately from the web server as containerized jobs.

- Add documentation for including additional subsetting jobs as containerized objects.

- Implement usage tracking that is consistent with other Compute and Modeling services, e.g. Prometheus or similar technology.

## 3 Constraints

This service is currently being used by the community and is a critical part of the NSF HydroFrame project. As such, upgrades to the system cannot cause prolonged downtime.


## 4 Design Considerations


#### 4.1 Native Kubernetes

In this option we modify the existing worker pool such that each job is represented as a Kubernetes Node Pool. This allows us to have multiple workers waiting for job requests to operate on. Domain data will be stored in a central location that can be mounted into the running jobs in their respective node pools. A queue service is used to hold the list of jobs to be executed. Workers listen to this queue and execute jobs that match their specific label/queue name.

![native kubernetes](./img/design-native-kubernetes.png)

#### 4.1.1 Pros

- Workers are containerized which resolves the dependency management problem.

- Workers execute jobs on VMs separate from the front-end/back-end components.

- New subsetting algorithms can be included by adding new node pools.

- Node pools can scale horizontally and vertically to meet the job demand.

#### 4.1.2 Cons

- Reduces cloud hosting cost, however the Kubernetes overhead cost and cost of running node pools is not negligible.


#### 4.2 Kubernetes Microservices - KNative

In this option we modify the existing worker pool such that each job is represented as a Function-as-a-Service (FaaS). This approach will still use Kubernetes as the orchestration layer, but will leverage one of the FaaS frameworks. This still allows us to have multiple workers waiting for job requests, however these workers are not running when inactive. Instead, the FaaS framework will start and stop worker VMs as needed, that is workers will run like lambda functions.

![micro kubernetes](./img/design-micro-kubernetes.png)

#### 4.2.1 Pros

- Workers are containerized which resolves the dependency management problem.

- Workers execute jobs on VMs separate from the front-end/back-end components.

- New subsetting algorithms can be included by adding new FaaS functions

- Minimizes Kubernetes overhead cost and cost of running worker functions.

- FaaS functions can scale to meet demand.

#### 4.2.2 Cons

- We may need to managing our own Kubernetes cluster.

### 4.4 Cloud Functions

Cloud-managed version of the previous option.

#### 4.4.1 Pros

- Workers are containerized which resolves the dependency management problem.

- Workers execute jobs as cloud functions separate from the front-end/back-end components.

- New subsetting algorithms can be included by adding new cloud functions.

- Google has optimized their cloud functions


#### 4.4.2 Cons

- Difficult to reproduce production/development environment locally.

- Migration to other cloud providers becomes much harder. Code will be coupled to firebase SDK meaning there may be future technical debt.


## 5. Proposed Design

<!--
## 5.1 Features

### 5.1.1 Software Architecture

- De-coupled front and back-end components.

- Containerized subsetting jobs.

- Horizontal scaling to support an arbitrary number of job submissions.

- Documentation for including additional subsetting jobs as containerized objects.

- Usage logging and archival using Prometheus (or similar technology)

### 5.1.2 Map

- NHD reach vectors and metadata (ID, Name).

- Upstream reach and watershed boundary tracing.



## 5.3 Proposed Design 

![system-architecture-2.0.png](./img/system-architecture-2.0.png)
<p align='center'>
Figure 3: Proposed System Architecture
</p>

### 5.3.1 Front-End

- Nginx load balancer?

- React + Typescript front-end that implements all v0.1 features.


### 5.3.2 Back-End


- FastAPI server or Flask

### 5.3.3 Communication Line

TODO

### 5.3.4 Queue

TODO

### 5.3.5 Workers

- Google Cloud Functions

### 5.3.6 Data Storage


- Results are stored in...

- Raw domain data is stored in... 

-->
