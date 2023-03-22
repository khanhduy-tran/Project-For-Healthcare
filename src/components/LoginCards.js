import React from "react";
import {Paper,Grid,Typography,Button,Box} from "@material-ui/core/";
import {Link} from 'react-router-dom';

function LoginCards() {  
    return (
    <>
    <Box m={1}>
        <Grid container spacing={1} justify="center" >
            <Grid item>
            <Paper>
                <Box p={1}>
                <Typography variant="h5">
                Quản Trị Viên   
                </Typography>
                <ul>
                    <li>Thêm mới Quản Trị Viên</li>
                    <li>Xóa Quản Trị Viên</li>
                    <li>Chủ sở hữu hợp đồng có thể chuyển quyền sở hữu của mình</li>
                </ul>

                </Box>
            </Paper>
            <Grid container justify="space-evenly">
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/admin">Đăng nhập</Button>
                    </Box>
                </Grid>
            </Grid>
            </Grid>

            <Grid item >
            <Paper>
                <Box p={1}>
                <Typography variant="h5">
                    Bệnh viện
                </Typography>
                <ul>
                    <li>Thêm bệnh nhân</li>
                    <li>Có thể xem hồ sơ của bệnh nhân với sự cho phép</li>
                    <li>Có thể thêm hồ sơ của bệnh nhân với sự cho phép</li>
                </ul>
                </Box>
            </Paper>
            <Grid container justify="space-evenly">
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/hospital">Đăng nhập</Button>
                    </Box>
                </Grid>
            </Grid>
            </Grid>

            <Grid item >
            <Paper>
                <Box p={1}>
                <Typography variant="h5">
                    Bệnh nhân
                </Typography>
                <ul>
                    <li>Có thể Đăng ký / Đăng nhập với tư cách là bệnh nhân</li>
                    <li>Có thể xem / thêm bản ghi của riêng mình</li>
                    <li>Có thể cấp / thu hồi quyền thêm / xem hồ sơ</li>
                </ul>
                </Box>
            </Paper>
            <Grid container justify="center" spacing={2}>
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/signup">Đăng ký</Button>
                    </Box>
                </Grid>
                <Grid item>
                    <Box mt={1}>
                        <Button variant="contained" color="primary" component={Link} to="/patient">Đăng nhập</Button>
                    </Box>
                </Grid>
            </Grid>
            </Grid>
        </Grid>
    </Box>
    </>
    );}
export default LoginCards;