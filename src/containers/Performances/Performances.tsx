import { FormControl, InputLabel, MenuItem, Select, Typography, withStyles } from "@material-ui/core";
import * as _ from "lodash";
import * as moment from "moment";
import * as React from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { connect } from "react-redux";

import { GetCampaigns, GetReports } from "../../actions";

import { styles } from "./Performances.style";

class Performances extends React.Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      campaign: "",
    };
  }

  public componentDidMount() {
    this.props.GetCampaigns(this.props.auth);
  }

  public handleChange = async (event: any) => {
    await this.props.GetReports(this.props.auth, event.target.value);
    this.setState({ [event.target.name]: event.target.value });
  }

  public render() {

    const { classes, campaigns, reports } = this.props;

    const lineData = () => {
      const dataObject = {
        datasets: [
          {
            backgroundColor: "rgba(75,192,192,0.4)",
            borderCapStyle: "butt",
            borderColor: "rgba(75,192,192,1)",
            borderDash: [] as any[],
            borderDashOffset: 0.0,
            borderJoinStyle: "miter",
            data: [] as any[],
            fill: false,
            label: "Campaign Confirmation",
            lineTension: 0.1,
            pointBackgroundColor: "#fff",
            pointBorderColor: "rgba(75,192,192,1)",
            pointBorderWidth: 1,
            pointHitRadius: 10,
            pointHoverBackgroundColor: "rgba(75,192,192,1)",
            pointHoverBorderColor: "rgba(220,220,220,1)",
            pointHoverBorderWidth: 2,
            pointHoverRadius: 5,
            pointRadius: 1,
          },
        ],
        labels: [] as any[],
      };
      const report = _.find(reports, { campaignId: this.state.campaign }) as any;
      if (report) {
        report.confirmations = _.sortBy(report.confirmations, (dateObj) => {
          return new Date(dateObj.confirmationDate);
        });
        for (const confirmation of report.confirmations) {
          const label = moment(confirmation.confirmationDate).format("MMMM Do HH");
          const i = _.findIndex(dataObject.labels, (o) => {
            return o === label;
          });
          if (i < 0) {
            dataObject.labels.push(label);
            dataObject.datasets[0].data.push(1);
          } else {
            dataObject.datasets[0].data[i] = dataObject.datasets[0].data[i] + 1;
          }
        }
      }
      return dataObject;
    };

    const doughnutData = () => {
      const dataObject = {
        datasets: [{
          backgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
          ],
          data: [] as any,
          hoverBackgroundColor: [
            "#FF6384",
            "#36A2EB",
            "#FFCE56",
          ],
        }],
        labels: [] as any,
      };
      const report = _.find(reports, { campaignId: this.state.campaign }) as any;
      if (report) {
        for (const confirmation of report.confirmations) {
          const type = confirmation.confirmationType;
          const i = _.findIndex(dataObject.labels, (o) => {
            return o === type;
          });
          if (i < 0) {
            dataObject.labels.push(type);
            dataObject.datasets[0].data.push(1);
          } else {
            dataObject.datasets[0].data[i] = dataObject.datasets[0].data[i] + 1;
          }
        }
      }
      return dataObject;
    };

    const listItems = campaigns.map((item: any) => {
      return (
        <MenuItem key={item.id} value={item.id}>{item.name}</MenuItem>
      );
    });
    return (
      <div className={classes.root}>
        <div style={{ margin: "15px" }}>
          <Typography variant="title">Campaign Performances</Typography>
        </div>
        <div className={classes.select}>
          <FormControl className={classes.formControl}>
            <InputLabel>Select Campaign</InputLabel>
            <Select inputProps={{
              name: "campaign",
            }} onChange={this.handleChange} value={this.state.campaign} name="role">
              {listItems}
            </Select>
          </FormControl>
        </div>
        <div>
          {this.state.campaign !== "" &&
            <Line data={lineData} height={300} options={{
              maintainAspectRatio: false,
            }} />
          }
        </div>
        <div>
          {this.state.campaign !== "" &&
            <Doughnut data={doughnutData} height={300} options={{
              maintainAspectRatio: false,
            }} />
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any, ownProps: any) => ({
  auth: state.authReducer,
  campaigns: state.campaignReducer.campaigns,
  reports: state.reportReducer.reports,
});

const mapDispathToProps = (dispatch: any, ownProps: any) => ({
  GetCampaigns: (auth: any) => dispatch(GetCampaigns(auth)),
  GetReports: (auth: any, campaignId: string) => dispatch(GetReports(auth, campaignId)),
});

export default withStyles(styles)(connect(mapStateToProps, mapDispathToProps)(Performances));
