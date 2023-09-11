import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Grid, Button, Container, Stack, Typography, Box, Popover, Paper, TextField } from '@mui/material';

export default function Category() {
  const [categories, setCategories] = useState([]); // State để lưu trữ dữ liệu từ API
  const [selectedCategory, setSelectedCategory] = useState(null); // State để lưu trữ danh mục đang được chọn
  const [anchorEl, setAnchorEl] = useState(null); // State để lưu trữ vị trí của popover
  const [newCategoryName, setNewCategoryName] = useState(''); // State để lưu trữ tên danh mục mới
  const [isAddingCategory, setIsAddingCategory] = useState(false); // State để xác định xem có nên hiển thị trường nhập liệu không

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:8521/api/v1/category/getAll');
        if (response.ok) {
          const data = await response.json();
          // Thêm một thuộc tính ngẫu nhiên "color" cho từng danh mục
          data.forEach((category) => {
            category.color = getRandomColor();
          });
          setCategories(data); // Lưu trữ dữ liệu từ API vào state 'categories'
        } else {
          console.error('Failed to fetch data');
        }
      } catch (error) {
        console.error('Error:', error);
      }
    };

    fetchData(); // Gọi hàm fetchData ngay lập tức khi useEffect được gọi
  }, []); // Dependency array trống để chỉ gọi fetchData một lần khi component được mount

  const getRandomColor = () => {
    // Hàm này sẽ trả về một màu sắc ngẫu nhiên
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 4; i += 1) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };

  const handleEditCategory = (category) => {
    // Xử lý sự kiện sửa danh mục ở đây
    console.log(`Edit category: ${category.categoryName}`);
    // Đóng popover sau khi xử lý
    setAnchorEl(null);
  };

  const handleDeleteCategory = (category) => {
    // Xử lý sự kiện xóa danh mục ở đây
    console.log(`Delete category: ${category.categoryName}`);
    // Đóng popover sau khi xử lý
    setAnchorEl(null);
  };

  const openPopover = (event, category) => {
    // Mở popover tại vị trí chuột và lưu trữ danh mục được chọn
    setSelectedCategory(category);
    setAnchorEl(event.currentTarget);
  };

  const closePopover = () => {
    // Đóng popover và xóa danh mục được chọn
    setSelectedCategory(null);
    setAnchorEl(null);
  };

  const handleAddCategory = () => {
    // Khi bạn nhấn "Add Category," hiển thị trường nhập liệu
    setIsAddingCategory(true);
  };

  const saveNewCategory = async () => {
    // Gửi POST request để thêm danh mục mới
    try {
      const response = await fetch('http://localhost:8521/api/v1/category/saveOrUpdate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ categoryName: newCategoryName }),
      });
      if (response.ok) {
        // Nếu thành công, cập nhật danh sách danh mục
        const data = await response.json();
        setCategories((prevCategories) => [...prevCategories, data]);
        setNewCategoryName(''); // Xóa tên danh mục mới sau khi thêm
        setIsAddingCategory(false); // Ẩn trường nhập liệu sau khi thêm
      } else {
        console.error('Failed to add category');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Helmet>
        <title>Category | Your App Name</title>
      </Helmet>

      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Categories
          </Typography>
          {!isAddingCategory && (
            <Button variant="contained" color="primary" onClick={handleAddCategory}>
              Add Category
            </Button>
          )}
        </Stack>

        {/* Hiển thị trường nhập tên danh mục mới khi isAddingCategory là true */}
        {isAddingCategory && (
          <Popover
            open={isAddingCategory}
            anchorEl={anchorEl}
            onClose={() => setIsAddingCategory(false)}
            anchorOrigin={{ vertical: 'center', horizontal: 'center' }}
            transformOrigin={{ vertical: 'center', horizontal: 'center' }}
          >
            <Box p={2}>
              <Typography variant="h6">Add New Category</Typography>
              <TextField
                label="Category Name"
                variant="outlined"
                fullWidth
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    saveNewCategory();
                  }
                }}
              />
              <Button variant="contained" color="primary" onClick={saveNewCategory}>
                Save
              </Button>
            </Box>
          </Popover>
        )}

        <Grid container spacing={3}>
          {categories.map((category) => (
            <Grid key={category.id} item xs={12} sm={6} md={4}>
              <Box
                p={2}
                border={1}
                borderRadius={4}
                borderColor="primary.main"
                style={{ backgroundColor: category.color, cursor: 'pointer' }}
                onClick={(event) => openPopover(event, category)}
              >
                {category.categoryName}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Popover
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          onClose={closePopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
          transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        >
          <Paper>
            <Button onClick={() => handleEditCategory(selectedCategory)}>Edit</Button>
            <Button onClick={() => handleDeleteCategory(selectedCategory)}>Delete</Button>
          </Paper>
        </Popover>
      </Container>
    </>
  );
}
