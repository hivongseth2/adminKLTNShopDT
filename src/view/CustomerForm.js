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
  RadioGroup,
  Switch,
  FormControlLabel,
  FormLabel,
  Radio,
  FormGroup,
  Snackbar,
  Alert,
} from '@mui/material';

import { useEffect, useState } from 'react';

import axios from 'axios';

const CustomerForm = ({ user, closeForm, trigger }) => {
  const [userData, setUserDate] = useState(user || {});
  const initialDate = user ? new Date(user.dateOfBirth) : new Date();

  //   const date = new Date(item.importDate);
  const [importDateStr, setImportDateStr] = useState(initialDate.toISOString().split('T')[0]);

  const [firstName, setFirstName] = useState(userData.firstName || '');
  const [lastName, setLastName] = useState(userData.lastName || '');
  const [email, setEmail] = useState(userData.email || 0);
  const [sex, setSex] = useState(userData.sex || '0');
  const [phone, setPhone] = useState(userData.phone || '');
  const [address, setAddress] = useState(userData.address || '');
  const [image, setImage] = useState(userData.image || '');
  const [checked, setChecked] = useState(user.account.enable || false);
  const [status, setStatus] = useState();
  const [roles, setRoles] = useState([]);
  const [passWord, setPassWord] = useState(userData.account.passWordA || '');
  const [customerType, setCustomerType] = useState(userData.customerType || '');
  const [role, setRole] = useState(userData.account.roles || []);

  //   ====

  // ==============

  const handleChangeStatus = (e) => {
    setChecked(e.target.checked);
    console.log(checked);
  };
  //   ========
  const handleChange = (event) => {
    const updatedRoles = roles.map((item) => {
      if (item.id === Number(event.target.name)) {
        item.status = !item.status;
      }
      return item;
    });

    setRoles(updatedRoles);
  };
  //   ===========
  const getRandomId = async () => {
    try {
      const response = await axios.get('http://localhost:8521/api/v1/customer/randomId');
      return response.data; // Use response.data to access the response body
      // return response.data; // You can return the data if needed
    } catch (err) {
      console.error('Error fetching randomId:', err);
      return null;
    }
  };

  const handleSave = async () => {
    let id = '';
    if (!userData.id) {
      id = await getRandomId();
    }

    let tempRole = role;
    const tempr = roles;
    tempRole = tempr
      .filter((item) => item.status === true)
      .map((item) => {
        const { status, ...rest } = item;
        return rest;
      });

    const account = {
      id: userData.account.id,
      email,
      passWordA: passWord,
      enable: checked,
      roles: tempRole,
    };

    const updatedItem = {
      ...(userData.id ? { id: userData.id } : { id }),
      firstName,
      lastName,
      email,
      dateOfBirth: new Date(importDateStr),
      image,
      sex: Number(sex),
      phone,
      address,
      account,

      customerType,
    };

    try {
      await axios.post('http://localhost:8521/api/v1/customer/createOrUpdate', updatedItem);
      trigger();
      closeForm();
    } catch (err) {
      console.error('Error saving customer:', err);
    }
  };

  useEffect(() => {}, [roles, role]);
  //   fetch category
  useEffect(() => {
    // Fetch categories from the API when the component mounts
    axios
      .get('http://localhost:8521/api/v1/roles/getList')
      .then((response) => {
        const modifiedResponse = response.data.map((item) => ({
          ...item,

          status: role.some((r) => r.id === item.id),
        }));

        setRoles(modifiedResponse);
        setRole(user ? userData.account.roles : '');
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
    <Grid container justifyContent="center" alignItems="center" position={'fixed'} top={'10%'} left={'0px'}>
      <Grid item xs={8} height={'100%'}>
        <Paper
          elevation={3}
          style={{ padding: '20px', background: '#F6FAFA', boxshadow: 'rgba(0, 0, 0, 0.35) 0px 5px 15px' }}
        >
          <form>
            <h2>Chỉnh sửa người dùng</h2>
            <Grid container spacing={2}>
              {/* ====Name */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="firstName">First Name</InputLabel>
                  <Input id="firstName" type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="lastName">Last Name</InputLabel>
                  <Input id="lastName" type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </FormControl>
              </Grid>

              {/* =============================================== */}

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="email">Email</InputLabel>
                  <Input id="email" type="text" value={email} onChange={(e) => setEmail(e.target.value)} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="dateOfBirth">Ngày sinh</InputLabel>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    onChange={(e) => setImportDateStr(e.target.value)}
                    value={importDateStr}
                  />
                </FormControl>
              </Grid>

              {/* =========== */}
              <Grid item xs={6}>
                <FormControl>
                  <FormLabel id="demo-row-radio-buttons-group-label">Giới tính</FormLabel>

                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    defaultValue={sex ? String(sex) : '0'}
                    onChange={(e) => {
                      setSex(e.target.value);
                      console.log(sex);
                    }}
                  >
                    <FormControlLabel value="0" control={<Radio />} label="Female" />
                    <FormControlLabel value="1" control={<Radio />} label="Male" />
                  </RadioGroup>
                </FormControl>
              </Grid>

              {/* ============== */}

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="phone">Phone</InputLabel>
                  <Input id="phone" type="number" onChange={(e) => setPhone(e.target.value)} value={phone} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="address">Address</InputLabel>
                  <Input id="address" type="text" onChange={(e) => setAddress(e.target.value)} value={address} />
                </FormControl>
              </Grid>
              {/* ========= */}

              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="images">Images</InputLabel>
                  <Input id="images" type="text" value={image} onChange={(e) => setImage(e.target.value)} />
                </FormControl>
              </Grid>

              {/* ============= */}
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel htmlFor="password">Password</InputLabel>
                  <Input id="password" type="text" onChange={(e) => setPassWord(e.target.value)} value={passWord} />
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <InputLabel htmlFor="status">Status</InputLabel>

                <FormControl fullWidth>
                  <Switch
                    id="status"
                    checked={checked}
                    onChange={(e) => {
                      handleChangeStatus(e);
                    }}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                </FormControl>
              </Grid>

              {/* ============== */}

              <Grid item xs={12}>
                <InputLabel>Roles</InputLabel>

                <FormControl fullWidth>
                  <FormGroup row style={{ marginLeft: '10em' }}>
                    {roles &&
                      roles.length > 0 &&
                      roles.map((role) => (
                        <FormControlLabel
                          key={role.id}
                          id="roles"
                          control={
                            <Switch checked={role.status} onChange={(e) => handleChange(e)} name={role.id.toString()} />
                          }
                          label={role.name}
                        />
                      ))}
                  </FormGroup>
                </FormControl>
              </Grid>
              {/* ============ */}

              {/*  */}

              <Grid item xs={6}>
                <Button onClick={handleSave} color="success">
                  Save
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button onClick={() => handleCancel()}>Cancel</Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
};

export default CustomerForm;
