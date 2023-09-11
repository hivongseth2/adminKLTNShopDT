import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Stack } from '@mui/material';

const AddSupplier = ({ onClose }) => {
  const [supplierInfo, setSupplierInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setSupplierInfo((prevInfo) => ({
      ...prevInfo,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    // Gửi thông tin nhà cung cấp lên API hoặc thực hiện xử lý tại đây

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(supplierInfo),
    };

    try {
      const response = await fetch('http://localhost:8521/api/v1/suppliers/saveOrUpdate', requestOptions);
      if (response.ok) {
        // Xử lý thành công, có thể đóng modal và thực hiện các hành động khác
        onClose();
        console.log('Supplier added successfully.');
      } else {
        // Xử lý lỗi nếu có lỗi từ API
        console.error('Failed to add supplier.');
      }
    } catch (error) {
      // Xử lý lỗi nếu có lỗi xảy ra trong quá trình gửi request
      console.error('Error:', error);
    }
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Add Supplier
      </Typography>
      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Supplier Name"
            variant="outlined"
            name="name"
            value={supplierInfo.name}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Email"
            variant="outlined"
            name="email"
            value={supplierInfo.email}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Phone Number"
            variant="outlined"
            name="phone"
            value={supplierInfo.phone}
            onChange={handleChange}
            fullWidth
            required
          />
          <TextField
            label="Address"
            variant="outlined"
            name="address"
            value={supplierInfo.address}
            onChange={handleChange}
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="primary">
            Save
          </Button>
        </Stack>
      </form>
    </Container>
  );
};

export default AddSupplier;
