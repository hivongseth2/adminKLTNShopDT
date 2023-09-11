import { Helmet } from 'react-helmet-async';

import { useEffect, useState, useContext } from 'react';

import { Container, Typography, Button, ButtonGroup, Dialog, DialogContent, TextField, Stack } from '@mui/material';

import AddSupplier from '../view/AddSupplier';

import { CustomFetch } from '../utils/CustomFetch';

import Iconify from '../components/iconify';

// Các phần khác của mã

export default function SupplierPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [isAddSupplierDialogOpen, setIsAddSupplierDialogOpen] = useState(false);
  const handleOpenAddSupplierDialog = () => {
    setIsAddSupplierDialogOpen(true);
  };

  // Hàm này đóng modal thêm nhà cung cấp
  const handleCloseAddSupplierDialog = () => {
    fetchData();
    setIsAddSupplierDialogOpen(false);
  };

  const fetchData = async () => {
    try {
      const method = 'GET';
      const header = {
        'Content-Type': 'application/json',
      };
      const body = '';
      const path = '/suppliers/getAll';
      const data = await CustomFetch(path, method, body, header);

      if (data.errorCode !== undefined) {
        // Xử lý lỗi ở đây
        console.error('Error:', data.errorMessage);
      } else {
        // Xử lý dữ liệu khi thành công
        console.log(data);
        setSuppliers(data);
      }
    } catch (error) {
      // Xử lý lỗi nếu có lỗi xảy ra trong CustomFetch hoặc mạng
      console.error('Error:', error);
    }
  };
  useEffect(() => {
    fetchData(); // Gọi hàm fetchData ngay lập tức
  }, []);

  return (
    <>
      <Button variant="contained" onClick={handleOpenAddSupplierDialog} startIcon={<Iconify icon="eva:plus-fill" />}>
        Thêm nhà cung cấp mới
      </Button>

      {suppliers.length > 0 ? (
        <table className="table">
          <thead className="thead-dark">
            <tr>
              <th scope="col">#</th>
              <th scope="col">Tên nhà cung cấp</th>
              <th scope="col">Email</th>
              <th scope="col">Số điện thoại</th>
              <th scope="col">Địa chỉ</th>
              <th scope="col">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {suppliers.map((supplier, index) => (
              <tr key={supplier.id}>
                <th scope="row">{index + 1}</th>
                <td>{supplier.name}</td>
                <td>{supplier.email}</td>
                <td>{supplier.phone}</td>
                <td>{supplier.address}</td>
                <td>
                  <Button>Sửa</Button>
                  <Button>Xóa</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Danh sách nhà cung cấp trống</p>
      )}

      {/* =========== */}
      <Dialog
        open={isAddSupplierDialogOpen}
        onClose={handleCloseAddSupplierDialog}
        fetchData={fetchData}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          {/* Hiển thị AddSupplier component */}
          <AddSupplier onClose={handleCloseAddSupplierDialog} />
        </DialogContent>
      </Dialog>
    </>
  );
}
