import {
  Button,
  Icon,
  withStyles,
} from "material-ui";
import * as React from "react";
import { connect } from "react-redux";

import {
  AddFlightGeoCode,
  AddFlightSegment,
  GetGeocodes,
  GetSegments,
} from "../../../actions";

import FlightAddDayParting from "../FlightAddDayParting/FlightAddDayParting";
import FlightAddGeocode from "../FlightAddGeocode/FlightAddGeocode";
import FlightAddSegment from "../FlightAddSegment/FlightAddSegment";

import { styles } from "./FlightDetail.style";

class FlightDetail extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      openDayParting: false,
      openGeo: false,
      openSegment: false,
    };
  }
  public render() {
    const {
      addFlightGeoCode,
      addFlightSegment,
      classes,
      getSegments,
      getGeocodes,
      flight,
      user,
    } = this.props;
    const { openGeo, openSegment, openDayParting } = this.state;

    const handleClickOpenGeo = async () => {
      await getGeocodes(user);
      this.setState({ openGeo: true });
    };
    const handleCloseGeo = () => {
      this.setState({ openGeo: false });
    };
    const handleOkGeo = async (modalState: any) => {
      const { geocode } = modalState;
      await addFlightGeoCode(flight.id, user, geocode);
    };
    const handleClickOpenSegment = async () => {
      await getSegments(user);
      this.setState({ openSegment: true });
    };
    const handleCloseSegment = () => {
      this.setState({ openSegment: false });
    };
    const handleOkSegment = async (modalState: any) => {
      const { segment, priority } = modalState;
      const segmentRequest = {
        code: segment.code,
        priority,
      };
      await addFlightSegment(flight.id, user, segmentRequest);
    };
    const handleClickOpenDayParting = () => {
      this.setState({ openDayParting: true });
    };
    const handleCloseDayParting = () => {
      this.setState({ openDayParting: false });
    };
    const handleOkDayParting = async (modalState: any) => {
      this.setState({ openDayParting: false });
    };
    return (
      <div className={classes.currentExpansion}>
        <div>
          <Button
            onClick={handleClickOpenGeo}
            variant="raised"
            color="primary"
            className={classes.flightButtons}>
            Add Geocode
            <Icon className={classes.flightButtonIcons}>place</Icon>
          </Button>
          <Button
            onClick={handleClickOpenSegment}
            variant="raised"
            color="primary"
            className={classes.flightButtons}>
            Add Segment
            <Icon className={classes.flightButtonIcons}>bookmark</Icon>
          </Button>
          <Button
            onClick={handleClickOpenDayParting}
            variant="raised"
            color="primary"
            className={classes.flightButtons}>
            Add Day Parting
            <Icon className={classes.flightButtonIcons}>flight_takeoff</Icon>
          </Button>
        </div>
        <div>
          {flight.id}
        </div>
        <FlightAddDayParting
          open={openDayParting}
          handleClose={handleCloseDayParting}
          handleOk={handleOkDayParting}></FlightAddDayParting>
        <FlightAddGeocode
          open={openGeo}
          handleClose={handleCloseGeo}
          handleOk={handleOkGeo}></FlightAddGeocode>
        <FlightAddSegment
          open={openSegment}
          handleClose={handleCloseSegment}
          handleOk={handleOkSegment}></FlightAddSegment>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  user: state.userReducer,
});

const mapDispatchToProps = (dispatch: any, ownProps: any) => ({
  addFlightGeoCode: (flightID: any, user: any, geoCode: any) => dispatch(AddFlightGeoCode(flightID, user, geoCode)),
  addFlightSegment: (flightID: any, user: any, segment: any) => dispatch(AddFlightSegment(flightID, user, segment)),
  getGeocodes: (user: any) => dispatch(GetGeocodes(user)),
  getSegments: (user: any) => dispatch(GetSegments(user)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FlightDetail));