terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = "ap-southeast-1"
    access_key = ""
    secret_key = ""
}

# 1. Create vpc
resource "aws_vpc" "prod-vpc" {
  cidr_block = "10.0.0.0/16"
  tags = {
    Name = "easy1-production"
  }
}

# 2. Create internet gateway
resource "aws_internet_gateway" "gw" {
  vpc_id = aws_vpc.prod-vpc.id
}

# 3. Create custom Route table
resource "aws_route_table" "prod-route-table" {
  vpc_id = aws_vpc.prod-vpc.id

  route {
    cidr_block = "0.0.0.0/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  route {
    ipv6_cidr_block        = "::/0"
    gateway_id = aws_internet_gateway.gw.id
  }

  tags = {
    Name = "easy1-prod"
  }
}

# 4. Create a Subnet
resource "aws_subnet" "subnet-1" {
  vpc_id = aws_vpc.prod-vpc.id
  cidr_block = "10.0.1.0/24"
  availability_zone = "ap-southeast-1a"
}

# 5. Associate subnet with Route table
resource "aws_route_table_association" "a" {
  subnet_id = aws_subnet.subnet-1.id
  route_table_id = aws_route_table.prod-route-table.id
}

# 6. Create security group
resource "aws_security_group" "allow_web" {
  name        = "allow_web_traffic"
  description = "Allow Web inbound traffic"
  vpc_id      = aws_vpc.prod-vpc.id

  ingress {
    description      = "HTTPS"
    from_port        = 443
    to_port          = 443
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
    description      = "HTTP"
    from_port        = 80
    to_port          = 80
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  ingress {
    description      = "SSH"
    from_port        = 22
    to_port          = 22
    protocol         = "tcp"
    cidr_blocks      = ["0.0.0.0/0"]
  }
  
  ingress {
    description      = "All ICMP"
    from_port        = -1
    to_port          = -1
    protocol         = "icmp"
    cidr_blocks      = ["0.0.0.0/0"]
  }

  egress {
    from_port        = 0
    to_port          = 0
    protocol         = "-1"
    cidr_blocks      = ["0.0.0.0/0"]
    ipv6_cidr_blocks = ["::/0"]
  }

  tags = {
    Name = "allow_web"
  }
}

resource "aws_security_group" "allow_db" {
  name        = "allow_db_traffic"
  description = "Allow database inbound traffic"
  vpc_id      = aws_vpc.prod-vpc.id

  ingress {
    description      = "Database"
    from_port        = 5555
    to_port          = 5555
    protocol         = "tcp"
    cidr_blocks      = ["27.72.29.71/32", "13.215.235.203/32", "18.138.60.191/32"]
#    cidr_blocks      = ["0.0.0.0/0"]
  }
  
  ingress {
    description      = "Redis"
    from_port        = 6379
    to_port          = 6379
    protocol         = "tcp"
    cidr_blocks      = ["27.72.29.71/32", "13.215.235.203/32", "18.138.60.191/32"]
#    cidr_blocks      = ["0.0.0.0/0"]
  }
  
  ingress {
    description      = "RabbitMQ"
    from_port        = 5672
    to_port          = 5672
    protocol         = "tcp"
    cidr_blocks      = ["27.72.29.71/32", "13.215.235.203/32", "18.138.60.191/32"]
#    cidr_blocks      = ["0.0.0.0/0"]
  }
  
  ingress {
    description      = "MQTT"
    from_port        = 1883
    to_port          = 1883
    protocol         = "tcp"
    cidr_blocks      = ["27.72.29.71/32", "13.215.235.203/32", "18.138.60.191/32", "27.71.235.49/32"]
#    cidr_blocks      = ["0.0.0.0/0"]
  }

  tags = {
    Name = "allow_db"
  }
}

resource "aws_security_group" "allow_elastic" {
  name        = "allow_elastic_traffic"
  description = "Allow database inbound traffic"
  vpc_id      = aws_vpc.prod-vpc.id

  ingress {
    description      = "Elastic"
    from_port        = 9200
    to_port          = 9200
    protocol         = "tcp"
    cidr_blocks      = ["27.72.29.71/32", "13.215.235.203/32"]
  }

  tags = {
    Name = "allow_elastic"
  }
}

# 7. Create a network interface with an ip in the subnet that was create in step 4
resource "aws_network_interface" "web-server" {
  subnet_id       = aws_subnet.subnet-1.id
  private_ips     = ["10.0.1.50"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_network_interface" "elastic-search" {
  subnet_id       = aws_subnet.subnet-1.id
  private_ips     = ["10.0.1.51"]
  security_groups = [aws_security_group.allow_web.id, aws_security_group.allow_elastic.id]
}

resource "aws_network_interface" "backend" {
  subnet_id       = aws_subnet.subnet-1.id
  private_ips     = ["10.0.1.52"]
  security_groups = [aws_security_group.allow_web.id]
}

resource "aws_network_interface" "database" {
  subnet_id       = aws_subnet.subnet-1.id
  private_ips     = ["10.0.1.53"]
  security_groups = [aws_security_group.allow_web.id, aws_security_group.allow_db.id]
}

# 8. Assign an elastic IP to the network interface created in step 7
resource "aws_eip" "web-server" {
  vpc = true
  network_interface = aws_network_interface.web-server.id
  associate_with_private_ip = "10.0.1.50"
  depends_on = [aws_internet_gateway.gw]
}

resource "aws_eip" "elastic-search" {
  vpc = true
  network_interface = aws_network_interface.elastic-search.id
  associate_with_private_ip = "10.0.1.51"
  depends_on = [aws_internet_gateway.gw]
}

resource "aws_eip" "backend" {
  vpc = true
  network_interface = aws_network_interface.backend.id
  associate_with_private_ip = "10.0.1.52"
  depends_on = [aws_internet_gateway.gw]
}

resource "aws_eip" "database" {
  vpc = true
  network_interface = aws_network_interface.database.id
  associate_with_private_ip = "10.0.1.53"
  depends_on = [aws_internet_gateway.gw]
}

# 9. Create Ec2
resource "aws_instance" "gateway" {
  ami = "ami-00e912d13fbb4f225"
  instance_type = "t3.medium"
  availability_zone = "ap-southeast-1a"
  key_name = "devops"

  root_block_device {
    volume_type                 = "gp2"
    volume_size                 = 50
#    delete_on_termination       = true
  }
  
  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.web-server.id
  }
  
  user_data = <<-EOF
              #!bin/bash
              sudo apt update -y
              sudo apt install nginx -y
              sudo systemctl start nginx
              EOF
  
  tags = {
    Name = "gateway"
  }
}

resource "aws_instance" "elastic-search" {
  ami = "ami-00e912d13fbb4f225"
  instance_type = "t3.medium"
  availability_zone = "ap-southeast-1a"
  key_name = "devops"
  
  root_block_device {
    volume_type                 = "gp2"
    volume_size                 = 50
    #    delete_on_termination       = true
  }

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.elastic-search.id
  }

  user_data = <<-EOF
              #!bin/bash
              sudo apt update -y
              sudo apt install nginx -y
              sudo systemctl start nginx
              EOF

  tags = {
    Name = "elastic-search"
  }
}

resource "aws_instance" "backend" {
  ami = "ami-00e912d13fbb4f225"
  instance_type = "t3.medium"
  availability_zone = "ap-southeast-1a"
  key_name = "devops"
  
  root_block_device {
    volume_type                 = "gp2"
    volume_size                 = 50
    #    delete_on_termination       = true
  }

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.backend.id
  }

  user_data = <<-EOF
              #!bin/bash
              sudo apt update -y
              sudo apt install nginx -y
              sudo systemctl start nginx
              EOF

  tags = {
    Name = "backend"
  }
}

resource "aws_instance" "database" {
  ami = "ami-00e912d13fbb4f225"
  instance_type = "t3.medium"
  availability_zone = "ap-southeast-1a"
  key_name = "devops"
  
  root_block_device {
    volume_type                 = "gp2"
    volume_size                 = 50
    #    delete_on_termination       = true
  }

  network_interface {
    device_index         = 0
    network_interface_id = aws_network_interface.database.id
  }

  user_data = <<-EOF
              #!bin/bash
              sudo apt update -y
              sudo apt install nginx -y
              sudo systemctl start nginx
              EOF

  tags = {
    Name = "database"
  }
}