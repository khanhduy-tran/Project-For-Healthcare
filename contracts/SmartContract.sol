/**
 *Submitted for verification at Etherscan.io on 2020-10-02
*/

pragma solidity >=0.4.22 <0.7.0;
pragma experimental ABIEncoderV2;

contract ownable {
    
    address public owner;
    mapping(address=>bool) isAdmin;
    event OwnerChanged(address indexed _from,address indexed _to);
    event AdminAdded(address indexed Admin_Address);
    event AdminRemoved(address indexed Admin_Address);
    constructor() public{
        owner=msg.sender;
        isAdmin[msg.sender]=true;
    }
    
    modifier onlyOwner(){
        require(owner == msg.sender,"Chỉ Chủ sở hữu mới có quyền thực hiện hành động đó");
        _;
    }
    modifier onlyAdmin(){
        require(isAdmin[msg.sender] == true,"Chỉ Quản trị viên mới có quyền thực hiện hành động đó");
        _;
    }
    
    function setOwner(address _owner) public onlyOwner returns(bool success){
        require(msg.sender!=_owner,"Đã là chủ sở hữu của bạn");
        owner = _owner;
        emit OwnerChanged(msg.sender, _owner);
        return true;
    }
    function addAdmin(address _address) public onlyOwner returns(bool success){
        require(!isAdmin[_address],"Người dùng đã là quản trị viên !!!");
        isAdmin[_address]=true;
        emit AdminAdded(_address);
        return true;
    }
    function removeAdmin(address _address) public onlyOwner returns(bool success){
        require(_address!=owner,"Không thể xóa chủ sở hữu khỏi quản trị viên");
        require(isAdmin[_address],"Người dùng không phải là quản trị viên rồi !!!");
        isAdmin[_address]=false;
        emit AdminRemoved(_address);
        return true;
    }
}



contract Hospital is ownable {
    uint256 public index;
    mapping(address=>bool) isHospital;
    struct hospital {
        uint256 id;
        string hname;
        string haddress;
        string hcontact;
        address addr;
        bool isApproved;
    }
    mapping(address=>hospital) hospitals;
    address[] public hospitalList;
    
    modifier onlyHospital(){
        require(isHospital[msg.sender],"Chỉ bệnh viện mới có thể thêm bệnh nhân");
        _;
    }
    
    function addHospital(string memory _hname,string memory _haddress,string memory _hcontact,address _addr) public onlyAdmin{
        require(!isHospital[_addr],"Đã là một bệnh viện");
        hospitalList.push(_addr);
        index = index + 1;
        isHospital[_addr]=true;
        hospitals[_addr]=hospital(index,_hname,_haddress,_hcontact,_addr,true);
    }
    
    function getHospitalById(uint256 _id) public view returns(uint256 id,string memory hname,string memory haddress , string memory hcontact ,address addr , bool isApproved)  {
        uint256 i=0;
        for(;i<hospitalList.length;i++){
        if(hospitals[hospitalList[i]].id==_id){
            break;
        }
    }    
        require(hospitals[hospitalList[i]].id==_id,"ID bệnh viện không tồn tại");
        hospital memory tmp = hospitals[hospitalList[i]];
        return (tmp.id,tmp.hname,tmp.haddress,tmp.hcontact,tmp.addr,tmp.isApproved);
    }
    
    function getHospitalByAddress(address _address) public view returns(uint256 id,string memory hname,string memory haddress , string memory hcontact ,address addr , bool isApproved) {
        require(hospitals[_address].isApproved,"Bệnh viện không được chấp thuận hoặc không tồn tại");
        hospital memory tmp = hospitals[_address];
        return (tmp.id,tmp.hname,tmp.haddress,tmp.hcontact,tmp.addr,tmp.isApproved);
    }    
    
}

contract Patient is Hospital{
    
    uint256 public pindex=0;
    
    struct Records {
    string hname;
    string reason;
    string admittedOn;
    string dischargedOn;
    string ipfs;
    }
    
    struct patient{
        uint256 id;
        string name;
        string phone;
        string gender;
        string dob;
        string bloodgroup;
        string allergies;
        Records[] records;
        address addr;
    }

    address[] private patientList;
    mapping(address=>mapping(address=>bool)) isAuth;
    mapping(address=>patient) patients;
    mapping(address=>bool) isPatient;

    
    function addRecord(address _addr,string memory _hname,string memory _reason,string memory _admittedOn,string memory _dischargedOn,string memory _ipfs) public{
        require(isPatient[_addr],"Người dùng chưa đăng ký");
        require(isAuth[_addr][msg.sender],"Không có quyền thêm Bản ghi");
        patients[_addr].records.push(Records(_hname,_reason,_admittedOn,_dischargedOn,_ipfs));
        
    }
    
    function addPatient(string memory _name,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup,string memory _allergies) public {
        require(!isPatient[msg.sender],"Tài khoản bệnh nhân đã tồn tại");
        patientList.push(msg.sender);
        pindex = pindex + 1;
        isPatient[msg.sender]=true;
        isAuth[msg.sender][msg.sender]=true;
        patients[msg.sender].id=pindex;
        patients[msg.sender].name=_name;
        patients[msg.sender].phone=_phone;
        patients[msg.sender].gender=_gender;
        patients[msg.sender].dob=_dob;
        patients[msg.sender].bloodgroup=_bloodgroup;
        patients[msg.sender].allergies=_allergies;
        patients[msg.sender].addr=msg.sender;
    }
    
    function getPatientDetails(address _addr) public view returns(string memory _name,string memory _phone,string memory _gender,string memory _dob,string memory _bloodgroup,string memory _allergies){
        require(isAuth[_addr][msg.sender],"Không được phép lấy Hồ sơ");
        require(isPatient[_addr],"Không tìm thấy bệnh nhân nào tại địa chỉ đã cho");
        patient memory tmp = patients[_addr];
        return (tmp.name,tmp.phone,tmp.gender,tmp.dob,tmp.bloodgroup,tmp.allergies);
    }
    
    function getPatientRecords(address _addr) public view returns(string[] memory _hname,string[] memory _reason,string[] memory _admittedOn,string[] memory _dischargedOn,string[] memory ipfs){
        require(isAuth[_addr][msg.sender],"Không được phép lấy Hồ sơ");
        require(isPatient[_addr],"bệnh nhân chưa đăng nhập vào mạng của chúng tôi");
        require(patients[_addr].records.length>0,"hồ sơ bệnh nhân không tồn tại");
        string[] memory Hname = new string[](patients[_addr].records.length);
        string[] memory Reason = new string[](patients[_addr].records.length);
        string[] memory AdmOn = new string[](patients[_addr].records.length);
        string[] memory DisOn = new string[](patients[_addr].records.length);
        string[] memory IPFS = new string[](patients[_addr].records.length);
        for(uint256 i=0;i<patients[_addr].records.length;i++){
            Hname[i]=patients[_addr].records[i].hname;
            Reason[i]=patients[_addr].records[i].reason;
            AdmOn[i]=patients[_addr].records[i].admittedOn;
            DisOn[i]=patients[_addr].records[i].dischargedOn;
            IPFS[i]=patients[_addr].records[i].ipfs;
        }
        return(Hname,Reason,AdmOn,DisOn,IPFS);
    }
    
    function addAuth(address _addr) public returns(bool success) {
        require(!isAuth[msg.sender][_addr],"Đã được ủy quyền");
        require(msg.sender!=_addr,"Không thể tự thêm");
        isAuth[msg.sender][_addr] = true;
        return true;
    }

    function revokeAuth(address _addr) public returns(bool success) {
        require(msg.sender!=_addr,"Không thể xóa chính bạn");
        require(isAuth[msg.sender][_addr],"Chưa được ủy quyền");
        isAuth[msg.sender][_addr] = false;
        return true;
    }
    
    function addAuthFromTo(address _from,address _to) public returns(bool success) {
        require(!isAuth[_from][_to],"Đã Auth !!!");
        require(_from!=_to,"can't add same person");
        require(isAuth[_from][msg.sender],"Bạn không có quyền truy cập");
        require(isPatient[_from],"Người dùng chưa được đăng ký");
        isAuth[_from][_to] = true;
        return true;
    }
    
    function removeAuthFromTo(address _from,address _to) public returns(bool success) {
        require(isAuth[_from][_to],"Đã không có xác thực !!!");
        require(_from!=_to,"không thể loại bỏ cùng một người");
        require(isAuth[_from][msg.sender],"Bạn không có quyền truy cập");
        require(isPatient[_from],"Người dùng chưa được đăng ký");
        isAuth[_from][_to] = false;
        return true;
    }
    

}