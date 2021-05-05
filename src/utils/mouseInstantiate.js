import GT from 'gt-client';

// Code block to create text fields for username and room name
// ------------------------------------------------------------
const SERVER_NAME = "http://localhost:3000/"
const COMMON_ROOM_NAME = "triad_browser";

let userNameMap = new Map();
let userIDMap = new Map();
let userNameRowMap = new Map();
let userNameTeleMap = new Map();
var myUserRecord = undefined;

window.onload = async (event) => {

    let GTWrapper = document.createElement("div");
    GTWrapper.innerHTML = '<input id="usask-collab-text" placeholder="Username" type="text"><button id="usask-collab-button">Connect</button>';
    GTWrapper.style = 'position: absolute;top: 60px;height: 60px;z-index: 500;background: #000000;padding: 10px;text-align: center;padding-top: 15px;';
    document.body.prepend(GTWrapper);
    
    window.gt = new GT(SERVER_NAME);

    try {
        gt.connect();
    } catch (e) {
        // connection error! abort
        console.log("failed");
        return
    }

    gt.on('connect', id => {
        console.log(`We have connected, (${id}).`);

        let name = document.getElementById("usask-collab-text").value;

        // cancel any reconnect interval
        console.log(document.getElementById("usask-collab-button"));
        document.getElementById("usask-collab-button").addEventListener("click", () => connectUser() );
    });

    gt.on('joined', (room, state, users) => {
        console.log('Got whole new state:', state, users)
    
        // this could be us reconnecting, so check whether we 
        // know about other users before creating them
        for (const id in users) {
            if (userNameMap.has(users[id].name)) {
                // update instead of creating
                updateUser(users[id], id);
            } else {
                createUser(users[id], id);
            }
        }
    });
    
    gt.on('connect_error', error => {
        document.getElementById("usask-collab-button").disabled = "true";
        alert("Connection failed to collaboration server");
    })

}


function connectUser() {
    alert("Test");
    let name = document.getElementById("usask-collab-text").value;

    gt.auth(name).then(() => {
        gt.join(COMMON_ROOM_NAME, {
            x: 0,
            y: 0,
            name,
            color: '#eeeeee',
            latency: "?"
        });
    });
}

// *****************************************************************************
// Functions for user records
// *****************************************************************************

function createUser(user, id) {
    // check whether user exists (i.e., a reconnect)
    if (userNameMap.has(user.name)) {
        // remap new id to user
        userIDMap.set(id, user);
        connectInParticipantList(id);
        // TODO: remove old id (look through users by name)
        // update user info in case anything's changed
        updateUser(user, id);
    } else {
        // create new user object
        userNameMap.set(user.name, user);
        userIDMap.set(id, user);
        createUserRepresentation(user, id);
    }
    // store my record for later reconnections
    if (id == gt.id) {
        myUserRecord = userIDMap.get(id);
    }
}

function updateUser(delta, id) {
    const user = userIDMap.get(id);
    // update the map first
    for (let key in delta) {
        user[key] = delta[key];
    }
    // update the visual representations
    updateUserRepresentation(user, delta, id);
}


// ------------------------------------------------------------


// gt.on('connected', (id, user_payload) => {
//     console.log(`${id} has connected.`);
//     createUser(user_payload, id);
//     startSendingTelepointer();
// });

// gt.on('disconnected', (id, reason) => {
//     console.log(`${id} has disconnected (${reason}).`)
//     disconnectInParticipantList(id);
// });

// gt.on('user_updated_unreliable', (id, payload_delta) => {
//     //console.log('Got a userupdateunreliable:', id, payload_delta);
//     // special case for telepointers
//     if (payload_delta.x && payload_delta.y) {
//         if (id != gt.id) {
//             updateTelepointer(payload_delta.x, payload_delta.y, id);
//         }
//     } else {
//         // update anything else that may have been sent
//         updateUser(payload_delta, id);
//     }
// });

// gt.on('user_updated_reliable', (id, payload_delta) => {
//     console.log('Got a userupdatereliable:', id, payload_delta);
//     updateUser(payload_delta, id);
// });

// gt.on('state_updated_reliable', (id, payload_delta) => {
//     console.log('Got a stateupdatereliable:', id, payload_delta)
// });

// gt.on('state_updated_unreliable', (id, payload_delta) => {
//     console.log('Got a stateupdateunreliable:', id, payload_delta)
//     if (payload_delta.lat && payload_delta.lng) {
//         moveMap(payload_delta.lat, payload_delta.lng, id);
//     }
// });

// gt.on('pingpong', (latencyValue) => {
//     //console.log('Got a pong:', latencyValue);
//     gt.updateUserReliable({
//         latency: latencyValue
//     });
// });



// // *****************************************************************************
// // Telepointer
// // *****************************************************************************

// function addTelepointer(user, id) {
//     console.log("adding telepointer", user, user.name);
//     var tele = document.createElementNS("http://www.w3.org/2000/svg", "svg");
//     tele.setAttribute("height", "28px");
//     tele.setAttribute("width", "21px");
//     tele.style.position = "absolute";
//     tele.style.zIndex = 1000;

//     var pointer = document.createElementNS("http://www.w3.org/2000/svg", "polyline");
//     pointer.setAttribute("fill", user.color);
//     pointer.setAttribute("stroke", "#000000");
//     pointer.setAttribute("stroke-width", "1");
//     pointer.setAttribute("points", "0,0 0,25 8,20 13,28 16,27 11,19 21,19 0,0");
//     tele.appendChild(pointer);
//     document.body.appendChild(tele);
//     userNameTeleMap.set(user.name, tele);
//     console.log("Done adding telepointer", user, user.name);
// }

// function updateTelepointer(teleX, teleY, id) {
//     var user = userIDMap.get(id);
//     var tele = userNameTeleMap.get(user.name);
//     //tele.style.transform = "translate(" + teleX + "px," + teleY + "px)";
//     tele.style.top = teleY + "px";
//     tele.style.left = teleX + "px";
// }

// function startSendingTelepointer() {
//     window.addEventListener('mousemove', e => {
//         // FIX LATER: handle scrolling pages
//         //let offX = document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
//         //let offY = document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;
//         gt.updateUserUnreliable({
//             x: e.clientX,
//             y: e.clientY
//         });
//     });
// }


// // handleSubmit = () => {
// //     let { connection, roomName, userName } = this.props;

// //     if (connection) {
// //         this.DisconnectFromRoom(roomName, userName);
// //     } else {

// //         let tempRoomName = document.getElementById("RoomName").value;
// //         let tempUserName = document.getElementById("Username").value;
// //         let Connection = true;
// //         this.props.actions.setUsernameAndRoom(tempRoomName, tempUserName, Connection);

// //         this.ConnectToRoom(tempRoomName, tempUserName);
// //     }
// // }

// // async ConnectToRoom(roomName, userName) {
// //     await gt.auth(userName)

// //     console.log("ROOM", roomName);
// //     console.log("NAME", userName);


// //     let { room, roomState, users } = await gt.join(roomName, { 'User Name': userName })

// //     console.log(`We joined room ${room}\n\n`)

// //     console.log('The rooms state is:')
// //     console.log(roomState)
// //     console.log('\n\n')


// //     console.log('The users in the room and their states:')
// //     console.log(users)
// //     console.log('\n\n')
// //     return;
// // }

// // // DisconnectFromRoom = (roomName, userName) => {
// // //     let Connection = false;
// // //     this.props.actions.disconnectFromRoom(Connection);
// // //     // Actual code to disconnect 
// // //     return;
// // // }
