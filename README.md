# AWS Resume Website

![Architecture](https://github.com/SamAlber/aws-cloud-website/blob/283b6ba38074c5543b2523ca78dd6659aaf867de/frontend/assets/imgs/architecture.png)

## **Table of Contents**

1. [Project Overview](#project-overview)
   - [Key Features](#key-features)
2. [Services and Tools Used](#services-and-tools-used)
   - [AWS Services](#aws-services)
   - [Other Services and Tools](#other-services-and-tools)
3. [Development Flow](#development-flow)
   - [1. Frontend Development](#1-frontend-development)
   - [2. Backend Implementation](#2-backend-implementation)
     - [Handling S3 Bucket Configurations](#handling-s3-bucket-configurations)
     - [IAM Roles and Policies](#iam-roles-and-policies)
     - [Lambda Functions and Layers](#lambda-functions-and-layers)
     - [CloudFront and S3 Integration](#cloudfront-and-s3-integration)
     - [API Gateway and Lambda Integration](#api-gateway-and-lambda-integration)
     - [Terraform State Management](#terraform-state-management)
   - [3. Infrastructure Automation](#3-infrastructure-automation)
   - [4. Continuous Integration and Deployment (CI/CD)](#4-continuous-integration-and-deployment-cicd)
4. [Domain Purchase, DNS Zone, and SSL/TLS Configuration](#domain-purchase-dns-zone-and-ssltls-configuration)
   - [Domain Registration with Cloudflare](#domain-registration-with-cloudflare)
   - [DNS Zone Management](#dns-zone-management)
   - [SSL/TLS Integration with AWS ACM](#ssltls-integration-with-aws-acm)
5. [RSA Encryption and CloudFront Signed URLs](#rsa-encryption-and-cloudfront-signed-urls)
   - [How RSA Works in This Project](#how-rsa-works-in-this-project)
   - [Security Benefits](#security-benefits)
6. [User Flow](#user-flow)
   - [1. Accessing the Website](#1-accessing-the-website)
   - [2. Using Dynamic Features](#2-using-dynamic-features)
7. [Challenges and Solutions](#challenges-and-solutions)
   - [1. Handling CORS Issues](#1-handling-cors-issues)
   - [2. Managing Resource Dependencies in Terraform](#2-managing-resource-dependencies-in-terraform)
8. [Code Analysis](#code-analysis)
   - [1. Lambda Functions](#1-lambda-functions)
     - [Visitor Counter Lambda Function](#visitor-counter-lambda-function)
     - [CV Request Lambda Function](#cv-request-lambda-function)
     - [Cryptocurrency Price Tracker Lambda Function](#cryptocurrency-price-tracker-lambda-function)
   - [2. Frontend JavaScript](#2-frontend-javascript)
9. [Interview Questions and Answers](#interview-questions-and-answers)
10. [Future Goals](#future-goals)
11. [Additional Notes](#additional-notes)
    - [Understanding CORS and Preflight Requests](#understanding-cors-and-preflight-requests)
    - [Terraform Best Practices](#terraform-best-practices)
12. [Contact Information](#contact-information)

---

## **Project Overview**

Welcome to my AWS Resume Website project! This is a hands-on endeavor where I've integrated modern cloud technologies, DevOps practices, and web security best practices to create a dynamic resume website. It not only showcases my resume but also includes interactive features like a cryptocurrency price tracker and a visitor counter.

Check it out live at: [www.samuelalber.com](http://www.samuelalber.com)

### **Key Features**

1. **Static Website Hosting**:
   - Hosted on **Amazon S3** with **CloudFront** as a Content Delivery Network (CDN) to deliver content globally with low latency.
   - **Cloudflare** is used for DNS management and SSL/TLS configuration to enhance security and performance.
   - **Domain Purchased from Cloudflare**: The domain `samuelalber.com` was purchased through Cloudflare and configured to work seamlessly with AWS services.

2. **Dynamic Backend Functionalities**:
   - **Cryptocurrency Price Tracker**: Displays live cryptocurrency prices and logos fetched from an external API.
   - **CV Request Feature**: Allows users to request a copy of my CV via email using **AWS SES** and provides a secure, time-limited download link.
   - **Visitor Counter**: Tracks and displays the number of visitors using **DynamoDB** and **AWS Lambda**, showcasing real-time data updates.

3. **Infrastructure as Code**:
   - All resources are provisioned and managed using **Terraform**, ensuring consistency, version control, and scalability.

4. **Continuous Integration and Deployment**:
   - Implemented **GitHub Actions** to automate the deployment of the frontend website to S3 whenever changes are pushed to the Git repository.

5. **Security**:
   - **CloudFront Origin Access Control (OAC)** restricts direct access to the S3 bucket, ensuring content is served only through CloudFront.
   - **AWS Certificate Manager (ACM)** is used for managing SSL/TLS certificates, providing secure HTTPS communication.
   - Sensitive data such as API keys and configuration parameters are securely stored in **AWS Systems Manager Parameter Store**.

6. **Frontend**:
   - **Template-Based Design**: The frontend was built using a pre-designed template, which I customized to suit my needs.
   - Utilized **HTML**, **CSS**, and **JavaScript** to provide an interactive and responsive user experience.

---

## **Services and Tools Used**

### **AWS Services**

- **Amazon S3**: For static website hosting.
- **Amazon CloudFront**: Serves as the CDN to deliver content efficiently.
- **AWS Lambda**: Hosts serverless backend functions for API and business logic.
- **Amazon API Gateway**: Provides RESTful APIs for frontend-backend communication.
- **Amazon DynamoDB**: NoSQL database for storing visitor counts.
- **Amazon SES (Simple Email Service)**: Sends emails for CV requests.
- **AWS ACM (Certificate Manager)**: Manages SSL/TLS certificates for secure communication.
- **AWS SSM (Systems Manager) Parameter Store**: Secure storage for configuration data and secrets.

### **Other Services and Tools**

- **Cloudflare**:
  - **Domain Registration**: Purchased the domain `samuelalber.com` through Cloudflare.
  - **DNS Management**: Manages DNS settings, providing quick propagation and easy management.
  - **SSL/TLS Configuration**: Worked in conjunction with AWS ACM to ensure end-to-end encryption.

- **Terraform**: Infrastructure as Code tool used for provisioning and managing AWS resources.

- **GitHub Actions**: Used for Continuous Integration and Deployment (CI/CD) to automate the frontend deployment process.

---

## **Development Flow**

### **1. Frontend Development**

- **Template Customization**:
  - Started with a professional frontend template to ensure a polished and responsive design.
  - Customized the template extensively to reflect my personal branding and content.
  - Adjusted layouts, color schemes, and components to align with the project's requirements.

- **Dynamic Content with JavaScript**:
  - Implemented **JavaScript** to handle API calls and DOM manipulation.
  - Used **Fetch API** to retrieve data asynchronously from backend services.

### **2. Backend Implementation**

- **Programming Language**:
  - All backend code, including Lambda functions, was written in **Python**.

#### **Handling S3 Bucket Configurations**

- **Public Access Settings**:
  - Implemented strict S3 bucket policies to prevent public access:
    - Used `aws_s3_bucket_public_access_block` to block all public ACLs and policies, ensuring that even if an ACL is misconfigured, public access is still blocked.
    - Configured `aws_s3_bucket_ownership_controls` with `object_ownership = "BucketOwnerPreferred"` to ensure the bucket owner retains ownership of all objects, even if uploaded by other AWS accounts.
  - Set the bucket ACL to `private` using `aws_s3_bucket_acl` to enforce default object permissions.

- **CORS Configuration**:
  - For the website bucket, set up CORS rules to allow GET requests from any origin:
    - This is crucial for allowing CloudFront to fetch content from S3 and serve it to different domains.
    - Configured using `aws_s3_bucket_cors_configuration`.

#### **IAM Roles and Policies**

- **Resource-Based Policies vs. Identity-Based Policies**:
  - Used resource-based policies (e.g., S3 bucket policies) to grant access to specific resources.
  - Attached identity-based policies to IAM roles to grant permissions to AWS services like Lambda.
  - Understood the importance of `sts:AssumeRole` in IAM roles, which allows AWS services to assume the role and gain necessary permissions.

- **Principal Types in Policies**:
  - Differentiated between service principals (e.g., `"Service": "lambda.amazonaws.com"`) and AWS principals (e.g., `"AWS": "arn:aws:iam::account-id:user/username"`).

#### **Lambda Functions and Layers**

- **Lambda Layers**:
  - Created Lambda Layers to include external Python libraries (e.g., `rsa`, `requests` modules) that are not available in the standard Lambda runtime.
  - This ensures that dependencies are managed efficiently and consistently across functions.

- **Using Boto3**:
  - Utilized the `boto3` library in Python code to interact with AWS services like DynamoDB, SES, and SSM Parameter Store.
  - Enabled dynamic data retrieval and manipulation within Lambda functions.

#### **CloudFront and S3 Integration**

- **Origin Access Control (OAC)**:
  - Configured CloudFront with OAC to securely access private S3 buckets:
    - Implemented using `aws_cloudfront_origin_access_control`.
    - Ensured that S3 buckets are not publicly accessible and can only be accessed through CloudFront.
  - Updated S3 bucket policies to allow access from CloudFront using the OAC.

- **Signed URLs and OAC Compatibility**:
  - Ensured that signed URLs work in tandem with OAC by properly configuring the CloudFront distribution and S3 bucket policies.
  - Established a secure chain of trust where users access content via CloudFront using signed URLs, and CloudFront accesses the S3 bucket using OAC.

#### **API Gateway and Lambda Integration**

- **Handling CORS and Preflight Requests**:
  - Configured API Gateway methods to handle OPTIONS requests for CORS preflight checks:
    - Added OPTIONS methods using `aws_api_gateway_method`.
    - Integrated these methods with Lambda functions using `aws_api_gateway_integration`.
  - For AWS_PROXY integrations, updated Lambda functions to handle OPTIONS requests and include necessary CORS headers in the responses.

- **Dependence Management in Terraform**:
  - Used `depends_on` in Terraform to ensure resources are created in the correct order.
  - This prevents deployment failures due to resource dependencies not being met.

#### **Terraform State Management**

- **Storing State Files Securely**:
  - Configured Terraform to use an S3 bucket as a remote backend for state files:
    - Enhanced collaboration by ensuring everyone uses the same state.
    - Improved security by storing state files remotely.
  - Enabled state locking with DynamoDB to prevent concurrent modifications:
    - Prevents state file corruption due to simultaneous operations.

- **Ignoring Unnecessary Files**:
  - Updated `.gitignore` to exclude directories like `.terraform/` and untracked them from the repository:
    - Ensures that local environment files are not pushed to version control.

### **3. Infrastructure Automation**

- **Terraform Configuration**:
  - Wrote Terraform scripts to define AWS resources like S3 buckets, Lambda functions, API Gateway, DynamoDB tables, and IAM roles.
  - Included detailed comments in the Terraform code to explain configurations and important considerations.
  - Used modules and organized code for clarity and reusability.

- **Version Control**:
  - Stored Terraform code in a Git repository for versioning and collaboration.
  - Ensured sensitive information is managed securely.

### **4. Continuous Integration and Deployment (CI/CD)**

- **GitHub Actions**:
  - Set up workflows to automatically deploy the frontend website to the S3 bucket whenever changes are pushed to the Git repository.
  - Configured actions to build, test, and deploy code, ensuring a streamlined development process.
  - Managed AWS credentials securely using GitHub Secrets.

- **Addressing Public Access Settings**:
  - Resolved issues with S3 bucket public access settings by adjusting bucket policies and removing unnecessary ACL configurations.
  - Ensured that the `--acl public-read` flag was used appropriately in deployment scripts.

---

## **Domain Purchase, DNS Zone, and SSL/TLS Configuration**

### **Domain Registration with Cloudflare**

- **Purchase and Registration**:
  - Purchased `samuelalber.com` from **Cloudflare**, taking advantage of their competitive pricing and reliable services.

### **DNS Zone Management**

- **DNS Records Configuration**:
  - Managed DNS settings in Cloudflare's DNS zone for `samuelalber.com`.
  - Set up CNAME records for both `www.samuelalber.com` and `samuelalber.com` pointing to the CloudFront distribution domain name.
    - This ensures that both the root domain and the www subdomain resolve correctly.
  - Used Terraform to automate the creation of DNS records:
    ```hcl
    resource "cloudflare_dns_record" "cdn_records" {
      for_each = {
        "root" = {
          name    = "samuelalber.com"
          content = aws_cloudfront_distribution.cdn.domain_name
          type    = "CNAME"
        }
        "www" = {
          name    = "www.samuelalber.com"
          content = aws_cloudfront_distribution.cdn.domain_name
          type    = "CNAME"
        }
      }
      name    = each.value.name
      content = each.value.content
      type    = each.value.type
      zone_id = var.cloudflare_zone_id
      ttl     = 300
    }
    ```

### **SSL/TLS Integration with AWS ACM**

- **Certificate Request and Validation**:
  - Requested SSL/TLS certificates from **AWS Certificate Manager (ACM)** for the domain and subdomains.
    - Used the Terraform resource `aws_acm_certificate` with `validation_method = "DNS"`.
  - Validated domain ownership through DNS validation:
    - Added CNAME records provided by ACM to Cloudflare's DNS settings using Terraform.
    - Example:
      ```hcl
      resource "cloudflare_dns_record" "acm_validation_records" {
        for_each = {
          for dvo in aws_acm_certificate.cert_for_cloudflare_dns.domain_validation_options : dvo.domain_name => {
            name    = replace(dvo.resource_record_name, "/\\.$/", "")
            content = replace(dvo.resource_record_value, "/\\.$/", "")
            type    = dvo.resource_record_type
          }
        }
        name    = each.value.name
        content = each.value.content
        type    = each.value.type
        zone_id = var.cloudflare_zone_id
        ttl     = 300
      }
      ```
  - Validated the certificate using `aws_acm_certificate_validation`.

- **End-to-End Encryption**

  - **Between User's Browser and CloudFront**:
    - **SSL/TLS Certificates**:
      - The user's browser establishes a secure HTTPS connection to CloudFront.
      - The SSL/TLS certificate used is issued by **AWS Certificate Manager (ACM)**.
      - This certificate is associated with the CloudFront distribution and covers `samuelalber.com` and `www.samuelalber.com`.
    - **Process**:
      - The browser trusts the certificate because it's issued by a trusted Certificate Authority (CA).
      - Ensures that data is encrypted in transit between the user's browser and CloudFront.

  - **Between CloudFront and S3**:
    - **CloudFront Origin Protocol Policy**:
      - Configured CloudFront to use HTTPS when communicating with the S3 origin.
      - Set `origin_protocol_policy = "https-only"` in the CloudFront distribution's origin settings.
    - **Certificates Used**:
      - AWS manages the certificates for the connection between CloudFront and S3.
      - These are internal AWS certificates, and the communication is secured within the AWS network.
    - **Security Benefit**:
      - Ensures that data remains encrypted during transit within AWS services.
      - Protects against potential interception even within the cloud environment.

---

## **RSA Encryption and CloudFront Signed URLs**

### **How RSA Works in This Project**

- **RSA Encryption**:
  - RSA is an asymmetric cryptographic algorithm that uses a pair of keys: a **public key** and a **private key**.
  - The **private key** is used to sign data, and the **public key** is used to verify the signature.

- **CloudFrontSigner and RSA in Python**:
  - In the Lambda function for the CV Request Feature, I used **CloudFrontSigner** from the `aws-cloudfront-sign` module.
  - The `CloudFrontSigner` requires an RSA private key to generate signed URLs.
  - The **rsa** Python library is used to load and manage the RSA private key within the code.

- **Generating Signed URLs**:
  - The Lambda function uses the RSA private key to sign a policy that includes the URL, expiration time, and access restrictions.
  - The signed URL allows temporary access to the CV stored in S3 via CloudFront, ensuring that only users with the signed URL can download the file.

### **Security Benefits**

- **Access Control**:
  - By using signed URLs, unauthorized users cannot access the content even if they know the URL, because they lack the valid signature.
  - The RSA-signed URL ensures that only users who have requested the CV and received the email can access the download link.

- **Time-Limited Access**:
  - The signed URLs have an expiration time, after which they become invalid.
  - This limits the window during which the CV can be downloaded, enhancing security.

- **Key Management**:
  - The RSA private key is securely stored in **AWS SSM Parameter Store**.
  - The public key is associated with a CloudFront key group, which CloudFront uses to verify the signature.
  - This separation ensures that even if the public key is exposed, the private key remains secure.

---

## **User Flow**

### **1. Accessing the Website**

When you type `www.samuelalber.com` into your browser, here's what happens behind the scenes:

1. **Browser Cache Check**:
   - The browser checks its local DNS cache to see if it already knows the IP address.

2. **Recursive DNS Resolver Query**:
   - If not cached, the browser queries a recursive DNS resolver (often provided by your ISP or a public DNS service like Google DNS).

3. **Root DNS Servers**:
   - The resolver starts at the root DNS servers, which handle queries for top-level domains (TLDs).

4. **Top-Level Domain (TLD) Servers**:
   - The resolver queries the TLD name servers responsible for `.com` domains to find the authoritative name servers for `samuelalber.com`.

5. **Cloudflare Authoritative Name Servers**:
   - The resolver contacts Cloudflare's authoritative name servers for `samuelalber.com`.

6. **DNS Record Retrieval**:
   - Cloudflare provides the DNS records, including the CNAME pointing to the AWS CloudFront distribution.

7. **Connecting to CloudFront**:
   - The browser resolves the CNAME to the CloudFront distribution's domain name.
   - **SSL/TLS Handshake**:
     - A secure HTTPS connection is established using the SSL/TLS certificate issued by AWS ACM and associated with the CloudFront distribution.
     - The browser verifies the certificate's validity and trustworthiness.

8. **Content Delivery**:
   - CloudFront serves the requested content:
     - **Cached Content**: Delivered immediately from the nearest edge location.
     - **Non-Cached Content**: Fetched from the origin S3 bucket, cached, and then delivered.

9. **Rendering the Website**:
   - The browser downloads the HTML, CSS, and JavaScript files.
   - The website is rendered, and dynamic content is loaded.

### **2. Using Dynamic Features**

#### **Cryptocurrency Price Tracker**:

1. **Frontend Request**:
   - JavaScript initiates a GET request to the API Gateway endpoint for cryptocurrency data.

2. **API Gateway Processing**:
   - Routes the request to the appropriate Lambda function written in Python.

3. **Lambda Execution**:
   - Fetches live data from an external cryptocurrency API.
   - Formats the data into a JSON response.

4. **Data Delivery**:
   - The response is sent back through API Gateway to the frontend.

5. **Dynamic Display**:
   - JavaScript updates the DOM to display current prices and logos.

#### **CV Request**:

1. **User Interaction**:
   - You enter your email address and click the "Receive My CV" button.

2. **API Call**:
   - The frontend sends a POST request containing your email to the API Gateway.

3. **Lambda Function Workflow**:
   - **Email Validation**: Ensures the email is in the correct format.
   - **Signed URL Generation**:
     - Uses the **rsa** library to load the RSA private key.
     - The **CloudFrontSigner** creates a signed URL using the private key.
     - The URL includes a policy that specifies expiration time and access permissions.
   - **Email Sending**: Sends an email via SES with the signed URL.

4. **Email Receipt**:
   - You receive an email with a secure link to download the CV.

5. **Secure Download**:
   - The link allows you to download the CV directly from CloudFront, with access controlled via the signed URL.
   - CloudFront uses the associated public key to verify the signature and enforce the policy.

#### **Visitor Counter**:

1. **Counter Request**:
   - Upon loading the website, JavaScript sends a GET request to the visitor counter API.

2. **Lambda Function Execution**:
   - **Read and Increment**: Retrieves the current count from DynamoDB, increments it, and writes it back.
   - **Concurrency Handling**: Uses DynamoDB's conditional updates to handle simultaneous requests.

3. **Response to Frontend**:
   - Sends the updated count back to the frontend.

4. **Display Update**:
   - The visitor count is updated on the website in real-time.

---

## **Challenges and Solutions**

### **1. Handling CORS Issues**

**Challenge**:

- Encountered CORS errors when the frontend JavaScript tried to make API calls to the backend services hosted on different domains.
- Specifically, pressing the "Receive My CV" button resulted in CORS errors due to missing or incorrect handling of preflight OPTIONS requests.

**Understanding Preflight CORS and the OPTIONS Method**:

- **What is CORS?**
  - Cross-Origin Resource Sharing (CORS) is a mechanism that allows a web page from one domain (origin) to access resources from a different domain.
  - Browsers enforce the Same-Origin Policy, which restricts web pages from making requests to a different origin unless the server explicitly allows it via CORS headers.

- **Preflight Requests**:
  - For certain types of cross-origin requests (e.g., those with custom headers or methods like POST), browsers send a preflight OPTIONS request to the server.
  - The preflight request checks if the actual request is safe to send.

- **OPTIONS Method**:
  - The server must respond to the OPTIONS request with appropriate CORS headers to indicate that the cross-origin request is allowed.
  - Required headers include:
    - `Access-Control-Allow-Origin`: Specifies which origins are allowed.
    - `Access-Control-Allow-Methods`: Specifies which HTTP methods are allowed.
    - `Access-Control-Allow-Headers`: Specifies which headers are allowed.

- **Why the Browser Thinks the Request is Safe Based on These Headers**:
  - The browser examines the response to the OPTIONS request.
  - If the response includes the necessary CORS headers allowing the origin, method, and headers, the browser proceeds with the actual request.
  - If not, the browser blocks the request to protect the user from potential security risks.

**Solution**:

- **API Gateway Configuration**:
  - Added the OPTIONS method to the API Gateway resources.
  - Configured the method and integration for OPTIONS using `aws_api_gateway_method` and `aws_api_gateway_integration` in Terraform.
  - Ensured that both the method and integration for OPTIONS were properly set up.

- **Lambda Function Adjustments**:
  - For AWS_PROXY integrations, modified Lambda functions to handle OPTIONS requests and include CORS headers in the response:
    ```python
    if event.get('httpMethod') == 'OPTIONS':
        return {
            "statusCode": 200,
            "headers": {
                "Access-Control-Allow-Origin": "*",
                "Access-Control-Allow-Methods": "POST,OPTIONS",
                "Access-Control-Allow-Headers": "Content-Type,Authorization",
            },
            "body": json.dumps({"message": "CORS preflight request success"})
        }
    ```
  - This ensures that the Lambda function responds appropriately to preflight requests.

- **Key Takeaways**:
  - **Mandatory Headers**:
    - Including CORS headers in the Lambda function responses is essential for the browser to accept the responses.
  - **Testing**:
    - Tested the API behavior using tools like `curl` and the API Gateway console to ensure that both OPTIONS and POST methods worked correctly.
  - **Understanding Browser Behavior**:
    - Recognized that browsers enforce CORS policies strictly, and proper handling is crucial for functionality.

### **2. Managing Resource Dependencies in Terraform**

**Challenge**:

- Deployment failures occurred because Terraform tried to create resources before their dependencies were ready.
- Specifically, the API Gateway deployment failed because methods and integrations were not fully set up.

**Solution**:

- **Using `depends_on`**:
  - Employed the `depends_on` attribute in Terraform resource blocks to define explicit dependencies.
  - For example, in the `aws_api_gateway_deployment` resource, added dependencies on methods and integrations:
    ```hcl
    resource "aws_api_gateway_deployment" "api_deployment" {
      depends_on = [
        aws_api_gateway_integration.lambda_integration,
        aws_api_gateway_integration.send_cv_post_integration,
        aws_api_gateway_integration.crypto_api_integration,
        aws_api_gateway_integration.send_cv_options_integration
      ]
      rest_api_id = aws_api_gateway_rest_api.viewer_count_api.id
    }
    ```
- **Organizing Terraform Code**:
  - Split Terraform configurations into modules and organized code for clarity.
  - Used `terraform.tfvars` for variable management.

---

## **Code Analysis**

### **1. Lambda Functions**

#### **Visitor Counter Lambda Function**

**File**: `lambda_function.py`

**Purpose**:

- Reads and updates the visitor count stored in a DynamoDB table.
- Handles concurrent requests and ensures data consistency.

**Key Components**:

- **Imports**:
  - `boto3`: AWS SDK for Python, used to interact with DynamoDB.
  - `os`: Access environment variables.
  - `json`: Handle JSON data.

- **DynamoDB Initialization**:
  ```python
  dynamodb = boto3.resource('dynamodb')
  table_name = os.environ['DYNAMODB_TABLE']
  table = dynamodb.Table(table_name)
  ```

- **Lambda Handler**:
  ```python
  def lambda_handler(event, context):
      # Define the primary key
      primary_key = "page_views"
      # Get current count
      response = table.get_item(Key={'counter_id': primary_key})
      # Increment count
      new_count = current_count + 1
      # Update count in DynamoDB
      table.put_item(Item={'counter_id': primary_key, 'view_count': new_count})
      # Return response with CORS headers
  ```

- **CORS Headers**:
  - Included in the response to allow cross-origin requests from the frontend.
  - Essential for browser acceptance.

**Notes**:

- **Decimal Conversion**:
  - DynamoDB returns numbers as `Decimal` objects.
  - Converted to `int` using `int()` to ensure JSON serialization.

- **Full Item Replacement with `put_item`**:
  - `put_item` replaces the entire item.
  - Must specify all attributes to avoid data loss.

#### **CV Request Lambda Function**

**File**: `SES_lambda.py`

**Purpose**:

- Handles CV requests by validating the email, generating a signed URL, and sending it via SES.

**Key Components**:

- **Imports**:
  - `boto3`: Interact with AWS services (SES, SSM).
  - `json`, `os`, `re`: Handle data and environment variables.
  - `datetime`, `timedelta`: Manage URL expiration.
  - `logging`: Log errors and information.
  - `CloudFrontSigner`, `rsa`: Generate signed URLs.

- **Email Validation**:
  ```python
  def is_valid_email(email):
      regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
      return re.match(regex, email) is not None
  ```

- **Parameter Retrieval**:
  - Fetches sensitive data like private keys from SSM Parameter Store.
  - Ensures secure handling of secrets.

- **RSA Signer Function**:
  ```python
  def rsa_signer(message):
      private_key_pem = get_parameter('/cloudfront/private_key')
      private_key = rsa.PrivateKey.load_pkcs1(private_key_pem.encode('utf-8'))
      return rsa.sign(message, private_key, 'SHA-1')
  ```

- **Generate Signed URL**:
  - Uses `CloudFrontSigner` with the RSA signer to create a time-limited URL.

- **Lambda Handler**:
  - Handles both POST and OPTIONS (CORS preflight) requests.
  - Validates input, generates signed URL, and sends email via SES.
  - Returns appropriate responses with CORS headers.

**Notes**:

- **Exception Handling**:
  - Logs errors and returns meaningful HTTP status codes.
  - Re-raises exceptions where necessary to maintain traceability.

- **Security Considerations**:
  - Stores private keys securely.
  - Validates email input to prevent misuse.

#### **Cryptocurrency Price Tracker Lambda Function**

**File**: `crypto_api.py`

**Purpose**:

- Fetches current prices for specified cryptocurrencies from an external API.

**Key Components**:

- **Imports**:
  - `json`, `requests`: Handle HTTP requests and JSON data.
  - `boto3`: Access SSM Parameter Store.

- **Parameter Retrieval**:
  - Retrieves API key securely from SSM.

- **Lambda Handler**:
  - Parses query parameters or JSON body to get symbols.
  - Makes an external API call to fetch prices.
  - Handles exceptions and returns data with CORS headers.

- **Response Parsing**:
  ```python
  prices = {
      symbol: data['data'][symbol]['quote']['USD']['price']
      for symbol in symbols.split(',') if symbol in data['data']
  }
  ```

**Notes**:

- **Error Handling**:
  - Returns detailed error messages for debugging.
  - Uses try-except blocks to catch and handle exceptions.

- **Default Symbols**:
  - Uses 'BTC,ETH' as default if no symbols are provided.

### **2. Frontend JavaScript**

#### **Visitor Counter Script**

**File**: `index.js`

**Purpose**:

- Fetches the visitor count from the backend API and updates the counter on the webpage.

**Key Components**:

- **DOM Manipulation**:
  ```javascript
  const counter = document.querySelector(".counter-number");
  counter.innerHTML = `Views: ${data.view_count}`;
  ```

- **Asynchronous Function**:
  - Uses `async/await` to handle the fetch operation.
  - Ensures the counter updates after data is retrieved.

#### **Cryptocurrency Price Tracker Script**

**Purpose**:

- Fetches cryptocurrency prices and displays them with logos on the webpage.

**Key Components**:

- **Fetch Prices**:
  ```javascript
  const response = await fetch(`${apiEndpoint}?symbols=${symbols}`);
  const data = await response.json();
  ```

- **Dynamic Content Generation**:
  - Creates DOM elements for each cryptocurrency.
  - Inserts logos, names, and prices into the page.

- **Error Handling**:
  - Logs errors to the console and handles cases where data is missing.

#### **CV Request Script**

**Purpose**:

- Handles the submission of the email form to request the CV.

**Key Components**:

- **Form Submission**:
  ```javascript
  async function sendEmailRequest() {
      // Validate email
      // Send POST request to API Gateway
      // Update status messages
  }
  ```

- **Email Validation**:
  - Uses a simple regex to validate the email format.

- **User Feedback**:
  - Updates the status message on the page to inform the user of success or errors.

---

## **Interview Questions and Answers**

Based on experiences shared by others who have completed similar projects, here are some potential interview questions and detailed answers:

### **1. What AWS services are you familiar with, and how did you use them in your project?**

**Answer:**

I am familiar with a range of AWS services, many of which I utilized in this project:

- **Amazon S3**: Used for hosting the static website content. It stores HTML, CSS, JavaScript, and image files.

- **Amazon CloudFront**: Configured as a CDN to distribute content globally with low latency. It improves performance by caching content at edge locations.

- **AWS Lambda**: Deployed serverless functions written in Python to handle backend logic, such as:

  - **Visitor Counter**: Increments and retrieves visitor counts using DynamoDB.
  - **CV Request Handler**: Generates signed URLs and sends emails via SES.
  - **Cryptocurrency Price Tracker**: Fetches real-time crypto prices from an external API.

- **Amazon API Gateway**: Exposed RESTful endpoints for the Lambda functions, enabling the frontend to interact with the backend services securely.

- **Amazon DynamoDB**: Served as a NoSQL database to store visitor counts efficiently and scalably.

- **Amazon SES (Simple Email Service)**: Sent emails containing secure links to download my CV.

- **AWS Certificate Manager (ACM)**: Managed SSL/TLS certificates to ensure secure HTTPS communication between clients and CloudFront.

- **AWS Systems Manager Parameter Store**: Stored sensitive information like API keys and RSA private keys securely.

- **IAM Roles and Policies**: Managed permissions and access controls, adhering to the principle of least privilege.

By integrating these services, I built a scalable, secure, and efficient application that demonstrates practical cloud engineering skills.

### **2. Can you explain the difference between public and private subnets and their significance in cloud architecture?**

**Answer:**

**Public Subnets**:

- **Definition**: A subnet whose associated route table directs traffic to the internet through an internet gateway.
- **Accessibility**: Resources in a public subnet can have public IP addresses, making them directly accessible from the internet.
- **Use Cases**: Hosting public-facing services like web servers, bastion hosts, or NAT gateways.

**Private Subnets**:

- **Definition**: A subnet that doesn't route traffic directly to the internet; it may use a NAT gateway or VPN connection for outbound traffic.
- **Accessibility**: Resources in a private subnet are not directly accessible from the internet, enhancing security.
- **Use Cases**: Hosting backend services like databases, application servers, or sensitive data processing.

**Significance in Cloud Architecture**:

- **Security**: Segregating resources into public and private subnets helps protect sensitive components from direct internet exposure.
- **Scalability**: Allows for better control over network traffic and scaling of different layers independently.
- **Compliance**: Meets regulatory requirements by isolating critical data and services.

In my project, although I primarily used serverless services that abstract away infrastructure management, understanding subnets is crucial for designing secure and efficient architectures, especially in VPC-based deployments.

### **3. Describe a 3-tier architecture and how you might implement it in AWS.**

**Answer:**

A 3-tier architecture separates an application into three layers:

1. **Presentation Tier (Frontend)**:
   - **Function**: User interface that interacts with users.
   - **AWS Implementation**: Amazon S3 for static website hosting, Amazon CloudFront for content delivery.

2. **Application Tier (Logic)**:
   - **Function**: Processes data, applies business logic.
   - **AWS Implementation**: AWS Lambda functions, Amazon EC2 instances, or AWS Elastic Beanstalk.

3. **Data Tier (Database)**:
   - **Function**: Stores and manages data.
   - **AWS Implementation**: Amazon RDS for relational databases, Amazon DynamoDB for NoSQL databases.

**Implementation in AWS**:

- **Frontend**: Host static content on S3, use CloudFront for CDN, and Route 53 for DNS.
- **Application Layer**: Deploy APIs using API Gateway and Lambda (serverless) or run applications on EC2 instances within an Auto Scaling group.
- **Data Layer**: Use RDS for structured data requiring relational integrity or DynamoDB for scalable NoSQL storage.

**Benefits**:

- **Scalability**: Each layer can scale independently based on demand.
- **Maintainability**: Easier to update or modify individual layers without affecting others.
- **Security**: Layers can be isolated using security groups and subnets.

In my project, while it's primarily serverless and doesn't use EC2 instances or VPCs, the principles of a 3-tier architecture are reflected in separating concerns between frontend, backend logic, and data storage.

### **4. How does DNS work, and how did you apply that knowledge in your project?**

**Answer:**

**How DNS Works**:

- **Domain Name System (DNS)** translates human-readable domain names (e.g., `www.samuelalber.com`) into IP addresses that computers use to identify each other on the network.
- **Resolution Process**:
  1. **Recursive Resolver**: Client queries a recursive resolver (ISP or public DNS).
  2. **Root Servers**: Resolver asks root DNS servers for the TLD (e.g., `.com`).
  3. **TLD Servers**: Provides the authoritative name servers for the domain.
  4. **Authoritative Name Server**: Returns the DNS records (e.g., A, CNAME) for the domain.

**Application in My Project**:

- **Domain Registration**: Purchased `samuelalber.com` through Cloudflare.
- **DNS Management**:
  - Configured DNS records in Cloudflare to point to the CloudFront distribution.
  - Used CNAME records for `www.samuelalber.com` and `samuelalber.com` pointing to the CloudFront domain.
- **SSL/TLS Certificate Validation**:
  - Added CNAME records in Cloudflare for DNS validation of ACM certificates.
- **Understanding DNS Propagation**:
  - Accounted for TTL and potential delays in DNS record updates.
- **Troubleshooting**:
  - Used knowledge of DNS to resolve issues with domain resolution and SSL certificates.

By understanding how DNS works, I ensured that users could reliably access my website and that secure connections were established.

### **5. Explain CICD automation and how you implemented it in your project.**

**Answer:**

**CI/CD Automation**:

- **Continuous Integration (CI)**: Practice of automating the integration of code changes from multiple contributors into a single software project. Involves automated testing and building.
- **Continuous Deployment/Delivery (CD)**: Automates the release of validated code to a production environment. Ensures that software can be reliably released at any time.

**Implementation in My Project**:

- **GitHub Actions**:
  - Set up a workflow triggered by pushes to the main branch.
  - **Steps**:
    - **Checkout Code**: Retrieves the latest code from the repository.
    - **Build Process**: If necessary, runs build scripts (e.g., compiling assets).
    - **Deploy to S3**:
      - Uses AWS CLI to sync the website files to the S3 bucket hosting the frontend.
      - Ensures that the S3 bucket content is up-to-date with the latest code.
    - **Invalidate CloudFront Cache**:
      - Sends a command to invalidate cached content, so users receive the latest version.
- **AWS Credentials**:
  - Managed securely using GitHub Secrets to store AWS access keys.
- **Benefits**:
  - **Automation**: Reduces manual effort and potential for errors.
  - **Speed**: Allows for rapid deployment of updates.
  - **Consistency**: Ensures that each deployment follows the same process.

By implementing CI/CD, I streamlined the development workflow, allowing for efficient and reliable updates to the website.

### **6. How did you use serverless architecture in your project, and what are its benefits?**

**Answer:**

**Use of Serverless Architecture**:

- **AWS Lambda**:
  - Deployed backend logic as Lambda functions, handling:
    - Visitor counting.
    - CV request processing.
    - Cryptocurrency price fetching.
- **API Gateway**:
  - Created RESTful APIs that trigger Lambda functions in response to HTTP requests.
- **Benefits of Serverless**:
  - **Scalability**: Automatically scales with demand without manual intervention.
  - **Cost-Effectiveness**: Pay only for compute time used; no charges when functions are idle.
  - **Reduced Operational Overhead**: No need to manage servers or infrastructure.
  - **Quick Deployment**: Faster to deploy and update code.

**Benefits in My Project**:

- **Efficiency**: Focused on writing code rather than managing servers.
- **Performance**: Achieved low-latency responses due to AWS's optimized infrastructure.
- **Reliability**: Leveraged AWS's high availability for Lambda functions.

By adopting serverless architecture, I built a responsive and scalable backend that complements the static frontend hosted on S3.

### **7. How does your website handle scalability, and how did you use S3 and CloudFront to improve performance?**

**Answer:**

**Handling Scalability**:

- **Amazon S3**:
  - Designed to handle virtually unlimited concurrent requests.
  - Automatically scales to accommodate traffic spikes.
- **Amazon CloudFront**:
  - Distributes content through a global network of edge locations.
  - Caches content closer to users, reducing load on the origin server (S3).

**Improving Performance**:

- **Reduced Latency**:
  - CloudFront delivers content from the nearest edge location to the user.
- **Offloading Origin Traffic**:
  - Frequent requests are served from the cache, minimizing S3 data transfer and reducing costs.
- **High Availability**:
  - Both S3 and CloudFront are highly available services with built-in redundancy.

**Benefits**:

- **Scalability**: The combination can handle sudden increases in traffic without degradation.
- **Cost Efficiency**: Reduced data transfer costs and efficient caching.
- **User Experience**: Faster page load times improve user satisfaction.

By leveraging S3 and CloudFront, my website is prepared to serve content quickly to users worldwide, regardless of traffic volume.

### **8. Can you explain how you managed IAM roles and policies in your project?**

**Answer:**

**IAM Roles and Policies Management**:

- **Principle of Least Privilege**:
  - Granted only the necessary permissions required for each service or function.
- **IAM Roles for Lambda Functions**:
  - Created specific roles for each Lambda function.
  - Attached policies that allow access to required services (e.g., DynamoDB, SES, SSM Parameter Store).
- **Policy Types**:
  - **Managed Policies**: Used AWS-managed policies when appropriate.
  - **Custom Policies**: Wrote custom policies for specific permissions.
- **Assume Role Policy**:
  - Configured `sts:AssumeRole` in the role's trust policy to allow Lambda to assume the role.
- **Resource-Based Policies**:
  - Applied to services like S3 to control access from specific sources (e.g., CloudFront).

**Example**:

- **Lambda Role for CV Request Function**:
  - Permissions to:
    - Send emails via SES.
    - Access parameters in SSM Parameter Store.
  - Trust relationship allowing Lambda service to assume the role.

**Benefits**:

- **Security**: Minimizes the risk of unauthorized access.
- **Auditability**: Clear policies make it easier to review and audit permissions.
- **Scalability**: Roles can be reused or modified as the project grows.

By carefully managing IAM roles and policies, I ensured secure and efficient access control across AWS services in the project.

---

## **Future Goals**

- **Portfolio Expansion**:
  - Add a dedicated section to showcase more of my projects, including descriptions, technologies used, and links to live demos or repositories.

- **User Authentication**:
  - Integrate **Amazon Cognito** for user registration and login functionality, enabling personalized experiences.

- **Enhanced Cryptocurrency Tracker**:
  - Include additional metrics like market trends, historical data graphs, and support for multiple cryptocurrencies.

- **Serverless Workflow Orchestration**:
  - Explore **AWS Step Functions** to manage complex serverless workflows, such as multi-step data processing tasks.

- **Monitoring and Analytics**:
  - Implement monitoring using **AWS CloudWatch** and analytics with **Amazon QuickSight** to gain insights into user interactions.

- **Advanced CI/CD Pipeline**:
  - Enhance the CI/CD pipeline with automated testing, linting, and security checks using tools like **AWS CodePipeline** and **CodeBuild**.

---

## **Additional Notes**

### **Understanding CORS and Preflight Requests**

- **CORS Configuration**:
  - In the context of AWS Lambda and API Gateway, when using AWS_PROXY integrations, the Lambda function must handle CORS, including OPTIONS preflight requests.

- **Which Headers Are Involved**:
  - `Access-Control-Allow-Origin`: Specifies the origin that is allowed to access the resource.
  - `Access-Control-Allow-Methods`: Specifies the HTTP methods (e.g., GET, POST) allowed when accessing the resource.
  - `Access-Control-Allow-Headers`: Specifies the headers allowed when making the actual request.

- **Why the Browser Thinks the Request is Safe Based on These Headers**:
  - The browser sends a preflight OPTIONS request to check if the server allows the cross-origin request.
  - If the server responds with the appropriate headers indicating permission, the browser proceeds with the actual request.
  - This mechanism prevents unauthorized cross-origin requests that could compromise security.

### **Terraform Best Practices**

- **Resource Comments**:
  - Included detailed comments in Terraform code to explain the purpose of configurations and any important considerations.

- **State Management**:
  - Set up a separate S3 bucket and DynamoDB table for storing and locking Terraform state files in a collaborative environment.
    - Example:
      ```hcl
      terraform {
        backend "s3" {
          bucket         = "terraform.tfstate-bucket"
          key            = "prod/terraform.tfstate"
          region         = "us-east-1"
          dynamodb_table = "tfstate-locks"
          encrypt        = true
        }
      }
      ```
  - Ensured the S3 bucket is private and accessible only to authorized users.

- **IAM Policies and Roles**:
  - Defined clear IAM roles and policies to manage permissions.
  - Used `sts:AssumeRole` to allow services like Lambda to assume roles with specific permissions.

- **Using Random Suffixes for Bucket Names**:
  - Implemented random strings to ensure uniqueness of S3 bucket names, as bucket names are globally unique.

---

## **Contact Information**

- **Email**: [your.email@example.com](sam.albershtein@gmail.com)
- **LinkedIn**: [linkedin.com](https://www.linkedin.com/in/samuel-albershtein-ba82931a0/)
- **GitHub**: [github.com](https://github.com/SamAlber)

Thank you for taking the time to explore my project! If you have any feedback or ideas for collaboration, I'd love to hear from you. Feel free to reach out via the contact information on my website.

---
