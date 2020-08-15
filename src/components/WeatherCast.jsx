import React, { useState, useEffect } from 'react';
import { Grid, Typography, TextField, makeStyles, Card, Button } from '@material-ui/core';
import Icon from '@material-ui/core/Icon';
import SearchIcon from '@material-ui/icons/Search';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import _ from 'lodash'
const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
        padding: 20,
    },
    searchBtn: {
        marginLeft: 10,
        marginTop: 10,
    },
    searchInput: {
        padding: 5,
    }
}));
export default function WeatherCast(props) {
    const classes = useStyles();
    const [searchInput, setSearchInput] = useState('');
    const [showLoader, setShowLoader] = useState(false);
    const [weatheReport, setWeatherReport] = useState([]);
    const handleChange = (e) => {
        // do something
        setSearchInput(e.target.value);
    }


    const invokeApi = () => {
        if (!_.isEmpty(searchInput)) {
            setShowLoader(true);
            axios.get(`http://api.openweathermap.org/data/2.5/forecast?q=${searchInput}&appid=1635890035cbba097fd5c26c8ea672a1&mode=json`)
                .then(res => {
                    setShowLoader(false);
                    const data = res.data;
                    let prevData = [];
                    const filteredData = [];
                    if (!_.isEmpty(data) && _.has(data, 'list') && !_.isEmpty(data.list)) {
                        _.each(data.list, (item) => {
                            const getdate = new Date(item.dt_txt).getDate();
                            if (!_.isEmpty(prevData)) {
                                if (!prevData.find((value) => value === getdate)) {
                                    prevData.push(getdate);
                                    filteredData.push(item);
                                }
                            } else {
                                prevData.push(getdate);
                                filteredData.push(item);
                            }
                            console.log('getdate', getdate)
                        })
                        data.list = filteredData;
                    }
                    setWeatherReport(res.data);
                }).catch(err => {
                    setShowLoader(false);
                })
        }

    }
    return (
        <div className={classes.root}>
            <Grid container spacing={3} direction="row"
                justify="center"
                alignItems="center">
                <Grid item xs={12} sm={3}>
                    <Typography variant="h5" gutterBottom>
                        Weather in your city
                     </Typography>
                </Grid>
                <Grid item xs={12} sm={5}>
                    <TextField id="Search" label="Search" variant="outlined" value={searchInput} onChange={handleChange} className={classes.searchInput} />
                    <Button variant="contained" size="large" color="primary" onClick={invokeApi} className={classes.searchBtn}
                        endIcon={<SearchIcon />}
                    >Search</Button>

                </Grid>
            </Grid>
            <Grid container spacing={3} justify={showLoader? 'center': 'start'}
                alignItems="center">
                {showLoader ?
                    <CircularProgress /> : null}
                {!_.isEmpty(weatheReport) ? _.map(weatheReport.list, (item) => (
                    <Grid item xs={12} sm={3}>
                        <Card className="weatherCard">
                            <Typography variant="h6" className="bg-orange">{new Date(item.dt_txt).toLocaleDateString()}</Typography>
                            <Typography variant="subtitle1" className="bg-gray w-auto">Temperature</Typography>
                            <div className="w-title">
                                <Typography varient="span" className="bg-gray">Min</Typography>
                                <Typography varient="span" className="bg-gray">Max</Typography>
                            </div>
                            <div className="w-title">
                                <Typography varient="span">{item.main.temp_min}</Typography>
                                <Typography varient="span">{item.main.temp_max}</Typography>
                            </div>
                            {/* presure */}
                            <div className="w-title">
                                <Typography varient="span">Pressure</Typography>
                                <Typography varient="span">{item.main.pressure}</Typography>
                            </div>
                            {/* humdity */}
                            <div className="w-title">
                                <Typography varient="span">Humidity</Typography>
                                <Typography varient="span">{item.main.humidity}</Typography>
                            </div>
                        </Card>
                    </Grid>)) : null}
            </Grid>

        </div>
    )
}
