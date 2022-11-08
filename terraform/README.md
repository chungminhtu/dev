TERRAFORM
=====
1. Một số câu lệnh khi sử dụng terraform

```bash
# khởi tạo terraform
terraform init
# xem mô hình được viết trong main
terraform plan
# triển khai mô hình
terraform apply
# xoá mô hình
terraform destroy --auto-approve
# VD xoá một phần tử trong mô hình
terraform destroy --target aws_instance.database
```