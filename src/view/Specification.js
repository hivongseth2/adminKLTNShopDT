import * as React from 'react';
import {
  Card,
  Table,
  Stack,
  Paper,
  Avatar,
  Button,
  Grid,
  Popover,
  Checkbox,
  TableRow,
  MenuItem,
  TableBody,
  TableCell,
  Container,
  Typography,
  TextField,
  IconButton,
  TableContainer,
  TablePagination,
} from '@mui/material';
import Collapse from '@mui/material/Collapse';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction';
import { useState, useEffect } from 'react';

import { TransitionGroup } from 'react-transition-group';
import Iconify from '../components/iconify';

const Specification = ({ product, closeForm }) => {
  const [spec, editSpec] = useState(product ? product.specifications : []);

  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [editedValue, setEditedValue] = useState('');
  const [editItem, setEditItem] = useState({});
  const handleSaveEdit = (item) => {
    // Thực hiện lưu chỉnh sửa (editedName và editedValue) ở đây
    setIsEditing(false);
  };

  useEffect(() => {
    console.log(product);
  });

  const startEditingItem = (item) => {
    setEditItem(item);
    setEditedName(item.specificationName);
    setEditedValue(item.specificationValue);
    setIsEditing(true);
  };

  function renderItem({ item, handleRemoveFruit }) {
    return (
      <ListItem>
        {isEditing && editItem === item ? (
          <Grid container direction="row" justifyContent="space-around" alignItems="center" xs={12}>
            <TextField
              label="Specification Name"
              variant="outlined"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
            />
            <TextField
              label="Specification Value"
              variant="outlined"
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleSaveEdit}>
              Save
            </Button>
          </Grid>
        ) : (
          <>
            <ListItemText>
              <div>
                {item.specificationName} : {item.specificationValue}
              </div>
            </ListItemText>
            <ListItemSecondaryAction>
              <IconButton edge="start" aria-label="edit" title="Edit" onClick={() => startEditingItem(item)}>
                <Iconify icon={'eva:edit-fill'} sx={{ mr: 2 }} />
              </IconButton>
              <IconButton edge="start" aria-label="delete" title="Delete" onClick={() => handleRemoveFruit(item)}>
                <Iconify icon={'eva:trash-2-outline'} />
              </IconButton>
            </ListItemSecondaryAction>
          </>
        )}
      </ListItem>
    );
  }

  const [specInBasket, setspecInBasket] = React.useState(spec.slice(0, 3));

  const handleAddFruit = () => {
    const nextHiddenItem = spec.find((i) => !specInBasket.includes(i));
    if (nextHiddenItem) {
      setspecInBasket((prev) => [nextHiddenItem, ...prev]);
    }
  };

  const handleEditFruit = (item) => {
    // Xử lý thao tác chỉnh sửa ở đây
  };

  const handleRemoveFruit = (item) => {
    setspecInBasket((prev) => [...prev.filter((i) => i !== item)]);
  };

  const addFruitButton = (
    <>
      <Grid container direction="row" justifyContent="space-around" alignItems="center" xs={12}>
        <TextField id="outlined-controlled" label="Key" xs={4} />

        <TextField id="outlined-controlled" label="Value" xs={4} />
      </Grid>

      <Grid container direction="row" justifyContent="center" alignItems="center" xs={12} marginTop={2}>
        <Button variant="contained" onClick={handleAddFruit}>
          Add fruit to basket
        </Button>
      </Grid>
    </>
  );

  return (
    <Container fixed style={{ boxShadow: ' rgba(0, 0, 0, 0.35) 0px 5px 15px', padding: '2em' }}>
      {addFruitButton}

      <List sx={{ mt: 1 }}>
        <TransitionGroup>
          {specInBasket.map((item) => (
            <Collapse key={item.name}>{renderItem({ item, handleRemoveFruit })}</Collapse>
          ))}
        </TransitionGroup>
      </List>
      <Button onClick={() => closeForm()}> Đóng</Button>
    </Container>
  );
};
export default Specification;
