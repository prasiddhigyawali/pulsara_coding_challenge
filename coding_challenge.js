// user groups or teams, i.e. at a hospital
// teams have users, and handle events for various types of patients
// users can be on or off call
const groups = [
    {
        "id": 1,
        "name": "Emergency Department",
        "events": [
            {
                "type": "on_inbound_ems",
                "patients": ["STEMI", "STROKE", "GENERAL"]
            },
            {
                "type": "on_inbound_transfer",
                "patients": ["GENERAL"]
            },
            {
                "type": "on_consult",
                "patients": ["STEMI", "STROKE", "GENERAL"]
            }
        ],
        "users": [
            { "id": 1, "name": "Matthew Kauffman", "on_call": false },
            { "id": 2, "name": "Mackenzie Wicker", "on_call": true },
            { "id": 5, "name": "Doctor Supervisor", "on_call": true }
        ]
    },
    {
        "id": 2,
        "name": "Cardiology",
        "events": [
            {
                "type": "on_activation",
                "patients": ["STEMI"]
            },
            {
                "type": "on_inbound_transfer",
                "patients": ["STEMI"]
            }
        ],
        "users": [
            { "id": 3, "name": "Chloe Cardiology", "on_call": true },
            { "id": 5, "name": "Doctor Supervisor", "on_call": false }
        ]
    },
    {
        "id": 3,
        "name": "Neurology",
        "events": [
            {
                "type": "on_activation",
                "patients": ["STROKE"]
            },
            {
                "type": "on_consult",
                "patients": ["STROKE"]
            }
        ],
        "users": [
            { "id": 4, "name": "Noel Neurologist", "on_call": false }
        ]
    },
    {
        "id": 4,
        "name": "General Nursing",
        "events": [
            {
                "type": "on_inpatient",
                "patients": ["GENERAL"]
            }
        ],
        "users": [
            { "id": 6, "name": "Bob Bandage", "on_call": true },
            { "id": 2, "name": "Mackenzie Wicker", "on_call": true }
        ]
    }
];

/**
 * Return a list of user IDs who should be notified of the given event
 *    -- only on call users for groups configured to handle the event should be included
 * @param {string} eventType - system event, e.g. "on_activation" or "on_inbound_ems"
 * @param {string} patientType - patient type, e.g. "STEMI", "STROKE", or "GENERAL"
 * @returns {int[]}
 */
function onCallUserIdsForEvent(eventType, patientType) {
    let onCallUserIds;
    groups.forEach((group) => {
        if(group['events'].some(event => event['type'] == eventType && event['patients'].includes(patientType))) {
            onCallUserIds = group["users"].filter((user) => user.on_call).map((user) => user["id"]);
        }
    })
    return onCallUserIds;
}

/**
 * Return group data for which the given user ID is on call
 * @param {int} userId -- the user ID to check
 * @returns {object[]} -- include the ID and name for each group in which the user is on call, i.e.
 *                        [{ "id": 1, "name": "Emergency Department" }]
 */
function onCallGroups(userId) {
    let onCallGroups = [];
    groups.forEach((group) =>  {
        if(group['users'].some(user => user['id'] == userId && user['on_call'] == true)) {
            onCallGroups.push({"id":group["id"], "name":group["name"]});
        }
    });
    return onCallGroups;
}

// todo(matthew): learn how to test array equality properly in plain JS xD
console.assert(onCallUserIdsForEvent("on_activation", "STEMI").join(',') === '3');
console.assert(onCallGroups(2).map((g) => g.id).sort().join(',') === '1,4');