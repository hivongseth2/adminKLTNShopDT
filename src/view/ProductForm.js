import {
  FormControl,
  InputLabel,
  FormHelperText,
  Input,
  Paper,
  Grid,
  Button,
  Select,
  MenuItem,
  AlertTitle,
  Alert,
} from '@mui/material';
import { useEffect, useState } from 'react';
import '../style/general.css';
import axios from 'axios';

const ProductForm = ({ product, closeForm, trigger }) => {
  const [item, setItem] = useState(product || {});
  const initialDate = product ? new Date(product.importDate) : new Date();

  //   const date = new Date(item.importDate);
  const [importDateStr, setImportDateStr] = useState(initialDate.toISOString().split('T')[0]);
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState('');
  const [brands, setBrands] = useState([]);
  const [brand, setBrand] = useState(item.brand || '');
  const [description, setDescription] = useState(item.description || '');
  const [image, setImage] = useState([]);
  const [images, setImages] = useState(item.imageProducts || []);
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [messAlert, setMessAlert] = useState('');
  const [price, setPrice] = useState(item.price || '');
  const [priceImport, setPriceImport] = useState(item.priceImport || '');
  const [productName, setProductName] = useState(item.productName || '');
  const [supp, setSupp] = useState('');
  const [suppliers, setSuppliers] = useState([]);

  //   ===========
  const getRandomId = async () => {
    try {
      const response = await axios.get('http://localhost:8521/api/v1/products/randomId');
      return response.data; // Use response.data to access the response body
      // return response.data; // You can return the data if needed
    } catch (err) {
      console.error('Error fetching randomId:', err);
      return null;
    }
  };

  const uploadImage = () => {
    const formData = new FormData();

    for (let i = 0; i < image.length; i += 1) {
      formData.append('multipartFiles', image[i]);
    }

    axios
      .post(`http://localhost:8521/api/v1/imageProducts/saveOrUpdateForList/${item.id}`, formData)
      .then((response) => {
        // Xóa tất cả các tệp tin sau khi tải lên thành công
        console.log(response);
        //  thêm responda vào images để cập nhật list ảnh
        setImages([...images, ...response.data]);
        setImage([]);

        setShowSuccessAlert(true); // Hiển thị thông báo thành công
        setMessAlert('Thêm ảnh thành công');
        // Tạm dừng hiển thị thông báo sau một khoảng thời gian
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000); // 3 giây
      })
      .catch((error) => {
        console.error('Error uploading images:', error);
      });
  };

  useEffect(() => {}, [image]);

  const handleSave = async () => {
    let id = '';
    if (!item.id) {
      id = await getRandomId();
    }
    const updatedItem = {
      ...(item.id ? { id: item.id } : { id }),
      brand,
      importDate: new Date(importDateStr),
      images,
      price,
      priceImport,
      productName,
      category: categories.find((cate) => cate.id === category),
      supplier: suppliers.find((supplier) => supp === supplier.id),
    };
    console.log('item send : ', updatedItem);
    try {
      await axios.post('http://localhost:8521/api/v1/products/saveOrUpdate', updatedItem);
      trigger();
      closeForm();
    } catch (err) {
      console.error('Error saving product:', err);
    }
  };
  // remove in list tạm
  const removeInListImg = (item, index) => {
    const updatedImage = [...image];
    updatedImage.splice(index, 1);
    setImage(updatedImage);
  };

  const removeImgFetch = (item, index) => {
    axios
      .delete(`http://localhost:8521/api/v1/imageProducts/delete/${item.id}`)
      .then((response) => {
        const updatedImage = [...images];
        updatedImage.splice(index, 1);
        setImages(updatedImage);
        setShowSuccessAlert(true); // Hiển thị thông báo thành công
        setMessAlert('Đã xóa ảnh thành công');

        // Tạm dừng hiển thị thông báo sau một khoảng thời gian
        setTimeout(() => {
          setShowSuccessAlert(false);
        }, 3000); // 3 giây
      })
      .catch((error) => {
        console.error('Error deleting image:', error);
      });
  };

  //   fetch category
  useEffect(() => {
    // Fetch categories from the API when the component mounts
    axios
      .get('http://localhost:8521/api/v1/category/getAll')
      .then((response) => {
        setCategories(response.data);
        setCategory(product ? product.category.id : '');

        return axios.get('http://localhost:8521/api/v1/suppliers/getAll');
      })
      .then((supplierResponse) => {
        setSuppliers(supplierResponse.data);
        setSupp(product ? product.supplier.id : '');
        // sửa link lại
        return axios.get('http://localhost:8521/api/v1/brands/getAll');
      })
      .then((brandResponse) => {
        setBrands(brandResponse.data);
        setBrand(product ? product.brand : '');
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  //   ===============
  const handleCancel = () => {
    closeForm();
  };

  return (
    <Grid container justifyContent="center" alignItems="center" position={'relative'} top={'-40%'}>
      <Grid item xs={8} height={'100%'}>
        <Paper
          elevation={3}
          style={{ padding: '20px', background: '#F6FAFA', boxshadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <form>
            <h2>Chỉnh sửa sản phẩm</h2>
            <Grid container spacing={2}>
              {/* <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="brand">Brand</InputLabel>
                  <Input id="brand" type="text" value={brand.name} onChange={(e) => setBrand(e.target.value)} />
                </FormControl>
              </Grid> */}

              <Grid item xs={6}>
                <InputLabel htmlFor="brand">Brand</InputLabel>

                <FormControl fullWidth>
                  <Select id="brand" value={brand} onChange={(e) => setBrand(e.target.value)}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {brands.map((brand) => (
                      <MenuItem key={brand.id} value={brand.id}>
                        {brand.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <InputLabel htmlFor="category">Category</InputLabel>

                <FormControl fullWidth>
                  <Select id="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category.id} value={category.id}>
                        {category.categoryName}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="description">Description</InputLabel>
                  <Input
                    id="description"
                    type="text"
                    // value={item.description}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <InputLabel marginBottom="2em">Images</InputLabel>
                <FormControl fullWidth>
                  <input
                    id="image"
                    type="file"
                    multiple
                    onChange={(e) => {
                      const filesArray = Array.from(e.target.files);
                      setImage(filesArray);
                    }}
                  />
                  <div className="ContainerImgForm">
                    {image.length > 0 &&
                      image.map((item, index) => {
                        return (
                          <div style={{ marginRight: '2em' }}>
                            <Button
                              className="close-button"
                              color="secondary"
                              onClick={() => removeInListImg(item, index)}
                            >
                              X
                            </Button>
                            <img
                              className="image"
                              style={{ width: '180px', height: 'auto' }}
                              alt="none"
                              src={URL.createObjectURL(item)}
                              key={item.name} // Thêm key để React có thể xác định các phần tử trong danh sách
                            />
                          </div>
                        );
                      })}
                  </div>
                </FormControl>
              </Grid>

              <div className="ContainerImgForm">
                {images.map((item, index) => (
                  <div style={{ marginRight: '2em' }}>
                    <Button
                      className="close-button"
                      variant="outlined"
                      color="error"
                      onClick={() => removeImgFetch(item, index)}
                    >
                      X
                    </Button>
                    <img className="imgInForm" alt="none" src={item.imageLink} />
                  </div>
                ))}
              </div>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="importDate">Import Date</InputLabel>
                  <Input
                    id="importDate"
                    type="date"
                    onChange={(e) => setImportDateStr(e.target.value)}
                    value={importDateStr}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="price">Price</InputLabel>
                  <Input id="price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="priceImport">Price Import</InputLabel>
                  <Input
                    id="priceImport"
                    type="number"
                    value={priceImport}
                    onChange={(e) => setPriceImport(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="productName">Product Name</InputLabel>
                  <Input
                    id="productName"
                    type="text"
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                  />
                </FormControl>
              </Grid>

              <Grid item xs={12}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="category">Nhà cung cấp</InputLabel>

                  <Select id="category" value={supp} onChange={(e) => setSupp(e.target.value)}>
                    <MenuItem value="">
                      <em>None</em>
                    </MenuItem>
                    {suppliers.map((sup) => (
                      <MenuItem key={sup.id} value={sup.id}>
                        {sup.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <Button onClick={handleSave} color="success">
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={() => handleCancel()}>Cancel</Button>
              </Grid>

              <Grid item xs={12}>
                <Button onClick={() => uploadImage()}>up anh</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
      {showSuccessAlert && (
        <Alert severity="success" style={{ position: 'fixed', top: '20px', right: '20px', zIndex: 9999 }}>
          <AlertTitle>Success</AlertTitle>
          <strong>{messAlert}</strong>
        </Alert>
      )}
    </Grid>
  );
};

export default ProductForm;
