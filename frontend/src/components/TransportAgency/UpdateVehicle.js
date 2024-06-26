import React, { Fragment, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import {
  clearError,
  updateVehicle,
  getVehicleDetails,
} from "../../actions/vehicleActions";
import { useAlert } from "react-alert";
import MetaData from "../layout/Header/MetaData";
import AccountTreeIcon from "@material-ui/icons/AccountTree";
import DescriptionIcon from "@material-ui/icons/Description";
import SpellcheckIcon from "@material-ui/icons/Spellcheck";
import DeleteIcon from "@material-ui/icons/Delete";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import SideBar from "../Admin/Sidebar";
import {
  Button,
  TextField,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
} from "@material-ui/core";
import { UPDATE_TRANSPORTAGENCY_VEHICLE_RESET } from "../../constants/vehicleConstants";
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';

const UpdateVehicle = () => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const navigate = useNavigate();
  const { id } = useParams();

  const { error, vehicle } = useSelector((state) => state.vehicleDetails);

  const {
    loading,
    error: updateError,
    isUpdated,
  } = useSelector((state) => state.vehicle);

  const [name, setName] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [capacity, setCapacity] = useState(0);
  const [model, setModel] = useState("");
  const [images, setImages] = useState([]);
  const [oldImages, setOldImages] = useState([]);
  const [imagesPreview, setImagesPreview] = useState([]);
  const [price, setPrice] = useState(0);
  const [quantity, setQuantity] = useState(0);
  const [customFeature, setCustomFeature] = useState("");
  const [customNotInclude, setCustomNotInclude] = useState(""); // Custom notInclude
  const [dynamicFeatures, setDynamicFeatures] = useState([]);
  const [dynamicNotIncludes, setDynamicNotIncludes] = useState([]);

  const vehicleId = id;


  useEffect(() => {
    if (vehicle && vehicle._id !== vehicleId) {
      dispatch(getVehicleDetails(vehicleId));
    } else {
      setName(vehicle.name);
      setVehicleType(vehicle.vehicleType)
      setModel(vehicle.model);
      setCapacity(vehicle.capacity);
      setOldImages(vehicle.images);
      setPrice(vehicle.price);
      setQuantity(vehicle.quantity);
      setCustomFeature(""); // Set customFeature
      setCustomNotInclude("");
      setDynamicFeatures(vehicle.features); // Set dynamicFeatures
      setDynamicNotIncludes(vehicle.notIncludes); // Set notIncludes
    }

    if (error) {
      alert.error(error);
      dispatch(clearError());
    }

    if (updateError) {
      alert.error(updateError);
      dispatch(clearError());
    }

    if (isUpdated) {
      alert.success("Vehicle Updated Successfully");
      navigate("/transportagency/dashboard");
      dispatch({ type: UPDATE_TRANSPORTAGENCY_VEHICLE_RESET });
    }
  }, [
    dispatch,
    alert,
    error,
    isUpdated,
    vehicleId,
    vehicle,
    updateError,
    navigate,
  ]);

  const updateVehicleSubmitHandler = (e) => {
    e.preventDefault();
    const myForm = new FormData();

    myForm.set("vehicleType", vehicleType);
    myForm.set("model", model);
    myForm.set("capacity", capacity);
    myForm.set("name", name);
    myForm.set("quantity", quantity);
    myForm.set("price", price);
    myForm.set("features", JSON.stringify(dynamicFeatures));
    myForm.set("notIncludes", JSON.stringify(dynamicNotIncludes)); // Store selected notIncludes as an array

    images.forEach((image) => {
      myForm.append("images", image);
    });

    dispatch(updateVehicle(vehicleId, myForm));
  };

  // const handleFeaturesChange = (feature) => {
  //   if (selectedFeatures.includes(feature)) {
  //     setSelectedFeatures(selectedFeatures.filter((item) => item !== feature));
  //   } else {
  //     setSelectedFeatures([...selectedFeatures, feature]);
  //   }
  // };
  const handleIncludeDelete = (index) => {
    const newDynamicFeatures = [...dynamicFeatures];
    newDynamicFeatures.splice(index, 1);
    setDynamicFeatures(newDynamicFeatures);
  };

  const addCustomFeature = () => {
    if (customFeature.trim() !== "") {
      setDynamicFeatures([...dynamicFeatures, customFeature]);
      setCustomFeature("");
    }
  };

  const addCustomNotInclude = () => {
    if (customNotInclude.trim() !== "") {
      setDynamicNotIncludes([...dynamicNotIncludes, customNotInclude]);
      setCustomNotInclude("");
    }
  };
  const handleNotIncludeDelete = (index) => {
    const newDynamicNotIncludes = [...dynamicNotIncludes];
    newDynamicNotIncludes.splice(index, 1);
    setDynamicNotIncludes(newDynamicNotIncludes);
  };

  const updateVehicleImagesChange = (e) => {
    const files = Array.from(e.target.files);

    setImages([]);
    setImagesPreview([]);
    setOldImages([]);

    files.forEach((file) => {
      const reader = new FileReader();

      reader.onload = () => {
        if (reader.readyState === 2) {
          setImagesPreview((old) => [...old, reader.result]);
          setImages((old) => [...old, reader.result]);
        }
      };

      reader.readAsDataURL(file);
    });
  };

  return (
    <Fragment>
      <MetaData title="Create Vehicle" />
      <div className="dashboard">
        <SideBar />
        <div className="newProductContainer myCont"
          style={{
            backgroundImage: `url(${require("../../assets/bt.jpg")})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
          }}
        >
          <form
            className="createProductForm"
            encType="multipart/form-data"
            onSubmit={updateVehicleSubmitHandler}
          >
            <h1>Update Vehicle</h1>
            <div>
              <DirectionsCarIcon />
              <input
                type="text"
                placeholder="Name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div>
              <AccountTreeIcon />
              <select
                onChange={(e) => setVehicleType(e.target.value)}
                value={vehicleType}
                name="vehicleType"
              >
                <option value="">Choose Vehicle Type</option>
                <option value="Car">Car</option>
                <option value="Bus">Bus</option>
                <option value="Van">Van</option>
                <option value="SUV">Suv</option>
              </select>
            </div>
            <div>
              <FormatListNumberedIcon />
              <input
                type="number"
                placeholder="Quantity"
                required
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </div>
            <div>
              <AttachMoneyIcon />
              <input
                type="number"
                placeholder="Price"
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>
            <div>
              <DirectionsCarIcon />
              <input
                type="text"
                placeholder="Model"
                required
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div>
              <PeopleAltIcon />
              <input
                type="number"
                placeholder="Capacity"
                required
                value={capacity}
                onChange={(e) => setCapacity(e.target.value)}
              />
            </div>

            <br />
            {/*includes*/}
  
              <div className="row">
                  <p className="include-para2">Includes:</p>
              </div>


              <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '1px' }}>
                
                  {dynamicFeatures.map((feature, index) => (
                    <div key={index} className="col-auto includeLabel" style={{ marginRight: '0px', marginBottom: '10px' }}>
                      <IconButton
                        onClick={() => handleIncludeDelete(index)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <ListItem>
                        <ListItemText primary={feature} />
                      </ListItem>
                    </div>
                  ))}
              </div>


              <div className="row custom-feature-container" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                 
                    <input className="cutsom-text-field" style={{ marginLeft: '5%', width: '94%' }}
                      type="text"
                      placeholder="Add Custom Feature"
                      value={customFeature}
                      onChange={(e) => setCustomFeature(e.target.value)}
                    />
                    <Button style={{ marginLeft: '5%', width: '94%' }}
                      variant="outlined"
                      color="primary"
                      type="button"
                      onClick={addCustomFeature}
                    >
                      Add
                    </Button>
              </div>
            

            <br />
            {/*Not includes*/}
              <div className="row">      
                  <p className="include-para2">Not Includes:</p>
              </div>

              <div className="row" style={{ display: 'flex', flexWrap: 'wrap', gap: '1px' }}>
                
                  {dynamicNotIncludes.map((notInclude, index) => (
                    <div key={index} className="col-auto includeLabel" style={{ marginRight: '0px', marginBottom: '10px' }}>
                      <IconButton
                        onClick={() => handleNotIncludeDelete(index)}
                        color="secondary"
                      >
                        <DeleteIcon />
                      </IconButton>
                      <ListItem>
                        <ListItemText primary={notInclude} />
                      </ListItem>
                    </div>
                  ))}
              </div>


              <div className="row custom-feature-container" style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                  
                    <input className="cutsom-text-field" style={{ marginLeft: '5%', width: '94%' }}
                      type="text"
                      placeholder="Not Included Features"
                      value={customNotInclude}
                      onChange={(e) => setCustomNotInclude(e.target.value)}
                    />
                    <Button style={{ marginLeft: '5%', width: '94%' }}
                      variant="outlined"
                      color="primary"
                      type="button"
                      onClick={addCustomNotInclude}
                    >
                      Add
                    </Button>
              </div>
        

            <br />
            <div id="createProductFormFile">
              <input
                type="file"
                name="avatar"
                accept="image/*"
                onChange={updateVehicleImagesChange}
                multiple
              />
            </div>

            <div id="createProductFormImage">
              {oldImages &&
                oldImages.map((image, index) => (
                  <img key={index} src={image.url} alt="Old Vehicle Preview" />
                ))}
            </div>

            <div id="createProductFormImage">
              {imagesPreview.map((image, index) => (
                <img key={index} src={image} alt="Vehicle Preview" />
              ))}
            </div>

            <Button
              id="createProductBtn"
              type="submit"
              disabled={loading ? true : false}
            >
              Update
            </Button>
          </form>
        </div>
      </div>
    </Fragment>
  );
};

export default UpdateVehicle;
