import {Chip,Card,Grid,Box,Paper, Typography,TextField, Button,CircularProgress,Dialog,DialogActions,DialogContent,DialogTitle} from '@material-ui/core';
import React, { Component} from 'react'
import Header from "../components/Header";
import InitialiseWeb3 from '../components/web3';


class Admin extends Component{
    DMR=null;account="";
    state={
        owner: "loading",
        account:"loading",
        addAddr: "",
        remAddr: "",
        chgOwner: "",
        addr:"",
        hname:"",
        hcontact:"",
        haddress:"",
        load:false,
        addview:false,
        viewH:false,
        dopen:false,
    }
    async componentWillMount() {
        let [dmr,accounts]=await InitialiseWeb3();
        this.DMR=dmr;
        this.account=accounts[0];
        let own = await this.DMR.methods.owner().call();
        await this.setState({owner:own,account:this.account});
        await console.log("owner\t"+this.state.owner);
      }
    
    onAddAddrChange = (event)=>{
        this.setState({addAddr:event.target.value},()=>console.log(this.state.addAddr));
    }
    
    onaddrChange = (event)=>{
        this.setState({addr:event.target.value},()=>console.log(this.state.addr));

    }
    onhnameChange = (event)=>{
        this.setState({hname:event.target.value},()=>console.log(this.state.hname));

    } 
    onhcontactChange = (event)=>{
        this.setState({hcontact:event.target.value},()=>console.log(this.state.hcontact));

    } 
    onhaddressChange = (event)=>{
        this.setState({haddress:event.target.value},()=>console.log(this.state.haddress));

    } 
    onAddSubmit =async (e)=> {
        e.preventDefault();
        await this.setState({load:true});
        try{
            await this.DMR.methods.addAdmin(this.state.addAddr).send({from:this.state.account}).then((res)=>{
                let result = res;
                console.log(result);
                this.setState({load:false});
                alert("Đã thêm quản trị viên thành công!");
            });
        }
        catch(e){
            await this.setState({load:false});
            alert("Lỗi");
        }

        
    }
    onRemSubmit =async (e)=> {
        e.preventDefault();
        await this.setState({load:true});
        try{
            await this.DMR.methods.removeAdmin(this.state.remAddr).send({from:this.state.account}).then((res)=>{
                let result = res;
                console.log(result);
                this.setState({load:false});
                alert("Xóa quản trị viên thành công!");
            });
        }
        catch(e){
            await this.setState({load:false});
            alert("Lỗi");
        }

    }
    onOwnSubmit=async (e)=> {
        e.preventDefault();
        await this.setState({load:true});
        try{
            await this.DMR.methods.setOwner(this.state.chgOwner).send({from:this.state.account}).then((res)=>{
                let result = res;
                console.log(result);
                this.setState({load:false});
                alert("Thay đổi chủ hợp đồng thành công!");
            });
        }
        catch(e){
            await this.setState({load:false});
            alert("Lỗi");
        }
        await this.setState({load:false});

    }
    onRemAddrChange = (event)=>{
        console.log(this.DMR);
        this.setState({remAddr:event.target.value},()=>console.log(this.state.remAddr));
    }

    onOwnAddrChange = (event)=>{
        this.setState({chgOwner:event.target.value},()=>console.log(this.state.chgOwner));
    }

    isLoading=()=>{
        if(this.state.load){
            return(
            <Box m={2}>
                <Grid container justify="center">
                    <Grid item>
                        <CircularProgress/>
                    </Grid>
                </Grid>
                
            </Box>
            );
        }
        return null;
    }
    addHospital = async ()=>{
        
        await this.setState({addview:false});
        await this.setState({load:true});
        try{
            await this.DMR.methods.addHospital(this.state.hname,this.state.haddress,this.state.hcontact,this.state.addr).send({from:this.state.account}).then((res)=>{
                let result = res;
                console.log(result);
                this.setState({load:false,addview:true});
                alert("Thêm bệnh viện thành công!");
            });
        }
        catch(e){
            await this.setState({load:false});
            alert("Lỗi");
        }
    }
    getHospital = async ()=>{
        
        await this.setState({viewH:false,addview:false,load:true});
        try{
            await this.DMR.methods.getHospitalByAddress(this.state.addr).call({from:this.state.account}).then((res)=>{
                let result = res;
                console.log(result);
                this.setState({load:false,addview:false,viewH:true,addr:result["addr"],hname:result["hname"],haddress:result["haddress"],hcontact:result["hcontact"],dopen:true});
            });
        }
        catch(e){
            await this.setState({load:false});
            alert("error");
        }
    }
    addHospitalView=()=>{
        if(this.state.addview){
        return(
            <Box>
                <Grid container justify="center">
                    <Grid item>
                        <Paper>

                        <Box p={2}>
                            
                            <Box p={0.3} justifyContent="center" display="flex" alignItems="center">
                                <Typography>Thêm bệnh viện</Typography>
                            </Box>
                            <Box m={0.3}>
                                <TextField label="Địa chỉ" onChange={this.onaddrChange}></TextField>
                            </Box>
                            <Box m={0.3}>
                                <TextField label="Tên bệnh viện" onChange={this.onhnameChange}></TextField>
                            </Box>
                            <Box m={0.3}>
                                <TextField label="Địa chỉ bệnh viện" onChange={this.onhaddressChange}></TextField>
                            </Box>
                            <Box m={0.3}>
                                <TextField label="Hợp đồng bệnh viện" onChange={this.onhcontactChange}></TextField>
                            </Box>
                            <Box  m={2} justifyContent="center" display="flex" alignItems="center">
                                <Button color={"primary"} onClick={this.addHospital} variant="contained">Gửi</Button>
                            </Box>
                        </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );}
        return null;
    }

    ViewHospital=()=>{
        if(this.state.viewH){
        return(
            <Box>
                <Dialog open={this.state.dopen} onClose={async ()=>{
                    
                }}>
                    <DialogTitle>Dữ liệu bệnh viện</DialogTitle>
                    <DialogContent>
                        
                            Tên:{"\t"+ this.state.hname}<br></br><br></br>
                            Địa chỉ:{"\t"+ this.state.haddress}<br></br><br></br>
                            Hợp đồng:{"\t"+ this.state.hcontact}<br></br><br></br>
                            Địa chỉ ví:{"\t"+ this.state.addr}<br></br>
                        
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={async ()=>{
                            this.setState({dopen:false});
                        }} variant="contained" style={{backgroundColor:"red",color:"white"}}>Đóng</Button>
                    </DialogActions>
                </Dialog>
                <Grid container justify="center">
                    <Grid item>
                        <Paper>
                            <Box p={2}>
                                <Box m={2} display="flex" alignItems="center" justifyContent="center">
                                    <Typography>
                                        Xem dữ liệu bệnh viện
                                    </Typography>
                                </Box>
                            <Grid container justify="center" spacing={3}>
                                <Grid item>
                                <TextField onChange={this.onaddrChange} size="small" label="Address" variant="outlined" value={this.state.addr}></TextField> 
                                </Grid>
                                <Grid item>
                                <Button onClick={this.getHospital} color="primary" variant="contained">Tìm kiếm</Button>
                                </Grid>
                            </Grid>

                            </Box>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        );}
        return null;
    }
    addremoveAdmin=(owner,account)=>{
        return (
            <Box mt={3}>
                <Box m={1}><Card>Chủ hợp đồng:{"\t"+owner}</Card></Box>
                <Box m={1}><Card>Tài khoản hiện tại:{"\t"+account}</Card></Box>
                <Grid container spacing={2} justify="center">
                    <Grid item>
                        <Paper>
                            <form onSubmit={this.onAddSubmit}>
                            <Box p={3}>
                            <Typography edge="start" variant="h6">Thêm quản trị viên</Typography>
                            <TextField id="addAddr" label="Enter Address" onChange={this.onAddAddrChange} value={this.state.addAddr}></TextField>
                            <Box m={2}>
                                <Button type="submit" variant="contained" color="primary">Gửi</Button>
                            </Box>
                            </Box>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper>
                        <form onSubmit={this.onRemSubmit}>
                        <Box p={3}>
                            <Typography variant="h6">Xóa quản trị viên</Typography>
                            <TextField id="remAddr" label="Enter Address" onChange={this.onRemAddrChange} value={this.state.remAddr}></TextField>
                            <Box m={2}>
                                <Button type="submit" variant="contained" color="primary">Gửi</Button>
                            </Box>
                            </Box>
                            </form>
                        </Paper>
                    </Grid>
                    <Grid item>
                        <Paper>
                        <form onSubmit={this.onOwnSubmit}>
                        <Box p={3}>
                            <Typography variant="h6">Thay đổi chủ hợp đồng</Typography>
                            <TextField id="ownAddr" label="Enter Address" onChange={this.onOwnAddrChange} value={this.state.chgOwner}></TextField>
                            <Box m={2}>
                                <Button type="submit" variant="contained" color="primary">Gửi</Button>
                            </Box>
                            </Box>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
                <Box m={1}>
                    <Grid container justify="center" spacing={3}>
                        <Grid item>
                            <Chip label="Thêm bệnh viện" style={{backgroundColor:"green"}} onClick={async ()=>{
                                await this.setState({viewH:false,addview:true,load:false});
                            }}></Chip>
                        </Grid>
                        <Grid item>
                            <Chip label="Xem bệnh viện" style={{backgroundColor:"red"}} onClick={async ()=>{
                                await this.setState({addview:false,viewH:true,load:false});
                            }}></Chip>
                        </Grid>
                    </Grid>
                </Box>
                
        </Box>);
     
      }
    render(){

        return(
            <>
            <Header></Header>
            {this.addremoveAdmin(this.state.owner,this.state.account)},
            {this.isLoading()},
            {this.addHospitalView()},
            {this.ViewHospital()}
            </>
        );
    }
}



export default Admin;