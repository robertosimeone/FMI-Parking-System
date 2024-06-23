function changeMatrix(table, rows, cols) {
    console.log("table.rows.length:", table.rows.length);
    console.log("table.rows[0].cells.length:", table.rows[0].cells.length);
    let oldrows = table.rows.length;
    let oldcols = table.rows[0].cells.length;


    if (rows < oldrows || cols < oldcols) {
        //form
        document.styleSheets[0].cssRules[41].style.visibility = "visible";
        //change size button
        document.styleSheets[0].cssRules[39].style.visibility = "hidden";


        const no = document.getElementById('agree-button-no');
        const yes = document.getElementById('agree-button-yes');

        no.addEventListener('click', () => {
            console.log("no");
            document.styleSheets[0].cssRules[41].style.visibility = "hidden";
            document.styleSheets[0].cssRules[39].style.visibility = "visible";
        }, false);

        yes.addEventListener('click', () => {
            console.log("yes");
            document.styleSheets[0].cssRules[41].style.visibility = "hidden";
            document.styleSheets[0].cssRules[39].style.visibility = "visible";

            const obj = {
                "faculty-code": table.id
            };
            fetch('../../backend/api/deleteAllParkCelssOfCertainFaculty.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(obj),
            })
                .then((httpData) => {
                    if (httpData.ok) {
                        return httpData.json();
                    }

                    return httpData.json().then(error => {
                        throw { error, url: httpData.url };
                    });
                })
                .then((data) => {
                    fetch('../../backend/api/deleteAllReservationsOfCertainFaculty.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(obj),
                    })
                        .then((httpData) => {
                            if (httpData.ok) {
                                return httpData.json();
                            }
                            return httpData.json().then(error => {
                                throw { error, url: httpData.url };
                            });
                        })
                        .then((data) => {
                            fetch('../../backend/api/deleteAllParkSpacesOfCertainFaculty.php', {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify(obj),
                            })
                                .then((httpData) => {
                                    if (httpData.ok) {
                                        return httpData.json();
                                    }

                                    return httpData.json().then(error => {
                                        throw { error, url: httpData.url };
                                    });
                                })
                                .then((data) => {
                                    console.log("ura");

                                    const userData = {
                                        "row": rows,
                                        "col": cols,
                                        "faculty-code": table.id
                                    };

                                    fetch('../../backend/api/updateMatrixSize.php', {
                                        method: 'POST',
                                        headers: {
                                            'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify(userData),
                                    })
                                        .then((httpData) => {
                                            if (httpData.ok) {
                                                return httpData.json();
                                            }

                                            return httpData.json().then(error => {
                                                throw { error, url: httpData.url };
                                            });
                                        })
                                        .then((data) => {
                                            console.log(data);
                                            table.innerHTML = "";
                                            for (let i = 0; i < rows; i++) {
                                                let current_row = table.insertRow(-1);
                                                for (let j = 0; j < cols; j++) {
                                                    let current_cell = current_row.insertCell(-1);
                                                    current_cell.classList.add("cell");
                                                }
                                            }

                                        })
                                        .catch((error) => {
                                            console.log(error);
                                        });
                                })
                                .catch((error) => {
                                    console.log(error);
                                });

                        })
                        .catch((error) => {
                            console.log(error);
                        });

                })
                .catch((error) => {
                    console.log(error);
                });

        }, false);
    }
    else {
        let newrowstoadd = Math.abs(rows - oldrows);
        let newcolstoadd = Math.abs(cols - oldcols);

        const userData = {
            "row": rows,
            "col": cols,
            "faculty-code": table.id
        };

        fetch('../../backend/api/updateMatrixSize.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        })
            .then((httpData) => {
                if (httpData.ok) {
                    return httpData.json();
                }

                return httpData.json().then(error => {
                    throw { error, url: httpData.url };
                });
            })
            .then((data) => {
                console.log(data);

                for (let i = 0; i < newrowstoadd; i++) {
                    console.log("row cycle:", i);
                    let current_row = table.insertRow(-1);
                    for (let j = 0; j < cols; j++) {
                        current_row.insertCell(-1);
                    }
                }
                for (let i = 0; i < oldrows; i++) {
                    current_row = table.rows[i];
                    for (let j = 0; j < newcolstoadd; j++) {
                        console.log("col cycle:", j);
                        current_row.insertCell(-1);
                    }
                }
            })
            .catch((error) => {
                console.log(error);
            });
    }
}



//tuka zapochva napravata na parkomqsto kato se zapomnqt indecxite na kletkite na suotvetniq fakultet v newlyAdded
function createParkPlace() {
    document.styleSheets[0].cssRules[15].style.visibility = "visible";
    document.styleSheets[0].cssRules[14].style.visibility = "hidden";
    document.styleSheets[0].cssRules[33].style.visibility = "visible";

    let styleElement = document.getElementById('dynamic-styles');
    if (!styleElement) {
        styleElement = document.createElement('style');
        styleElement.id = 'dynamic-styles';
        document.head.appendChild(styleElement);
    }

    // Get the CSSStyleSheet object
    let styleSheet = styleElement.sheet;
    const selectPP = document.getElementById('select-pp');
    // Define the CSS rule
    let selector = `#${selectPP.value} tr td:hover`;
    let rule = 'background:red;';

    // Add the new rule to the style sheet
    styleSheet.insertRule(selector + ' {' + rule + '}', styleSheet.cssRules.length);


    const selectedTable = document.getElementById(`${selectPP.value}`);

    //selectedTable.rows[0].cells[0].style.background="red";
    for (let i = 0; i < selectedTable.rows.length; i++) {
        for (let j = 0; j < selectedTable.rows[i].cells.length; j++) {
            selectedTable.rows[i].cells[j].addEventListener('click', () => {
                selectedTable.rows[i].cells[j].style.background = "red";
                newlyAdded[selectPP.value][i][j] = 1;
                console.log(newlyAdded);
            }, false)
        }
    }
}
//tuka zavurshva flowa s zapisvane na parkomqsto kato se zapazvat v db kakto i trqbva da se izchisti newlyAdded ot vkaranite stoinosti v nego

function saveParkPlace(number) {

    const facultyTable = document.getElementById(`${document.getElementById('select-pp').value}`);
    let cells = [];
    let ind = 0;
    for (let i = 0; i < newlyAdded[facultyTable.id].length; i++) {
        for (let j = 0; j < newlyAdded[facultyTable.id][i].length; j++) {
            if (newlyAdded[facultyTable.id][i][j] === 1) {
                cells[ind] = [];
                cells[ind] = [i, j];
                ind++;
            }
        }
    }
    const parkPlace = {
        "number": number,
        "faculty-code": facultyTable.id,
        "cells": cells,
    }
    fetch('../../backend/api/savingParkPlace.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(parkPlace),
    })
        .then((httpData) => {
            if (httpData.ok) {
                return httpData.json();
            }

            return httpData.json().then(error => {
                throw { error, url: httpData.url };
            });
        })
        .then((data) => {
            console.log(data);
            for (let i = 0; i < newlyAdded[facultyTable.id].length; i++) {
                for (let j = 0; j < newlyAdded[facultyTable.id][i].length; j++) {
                    if (newlyAdded[facultyTable.id][i][j] === 1) {
                        facultyTable.rows[i].cells[j].innerHTML = number;
                    }
                }
            }


            document.styleSheets[0].cssRules[14].style.visibility = "visible";
            document.styleSheets[0].cssRules[15].style.visibility = "hidden";
            document.styleSheets[0].cssRules[33].style.visibility = "hidden";
            let styleElement = document.getElementById('dynamic-styles');

            if (styleElement) {
                // Get the CSSStyleSheet object
                let styleSheet = styleElement.sheet;

                // Define the index of the rule you want to delete
                let ruleIndex = 0; // Replace with the desired index of the rule to delete

                // Delete the rule from the style sheet
                styleSheet.deleteRule(ruleIndex);
            }
            closeSavePPForm();
            newlyAdded[facultyTable.id] = createEmptyMatrix(facultyTable.rows.length, facultyTable.rows[0].cells.length);

        })
        .catch((error) => {
            console.log(error);

            const popupError = document.querySelector('.save-pp-popup-err-state');
            popupError.innerHTML = error["error"]["message"];
            popupError.style.visibility = "visible";
        });


}
function cancelSavePP() {
    document.styleSheets[0].cssRules[14].style.visibility = "visible";
    document.styleSheets[0].cssRules[15].style.visibility = "hidden";
    document.styleSheets[0].cssRules[33].style.visibility = "hidden";

    let styleElement = document.getElementById('dynamic-styles');

    if (styleElement) {
        // Get the CSSStyleSheet object
        let styleSheet = styleElement.sheet;

        // Define the index of the rule you want to delete
        let ruleIndex = 0; // Replace with the desired index of the rule to delete

        // Delete the rule from the style sheet
        styleSheet.deleteRule(ruleIndex);
    }
    const selectPP = document.getElementById('select-pp');
    const selectedTable = document.getElementById(`${selectPP.value}`);

    for (let i = 0; i < newlyAdded[selectedTable.id].length; i++) {
        for (let j = 0; j < newlyAdded[selectedTable.id][i].length; j++) {
            if (newlyAdded[selectedTable.id][i][j] === 1) {
                selectedTable.rows[i].cells[j].style.background = "white";
            }
        }
    }
    newlyAdded[selectedTable.id] = createEmptyMatrix(selectedTable.rows.length, selectedTable.rows[0].cells.length);

}
function createEmptyMatrix(rows, cols) {
    return Array.from({ length: rows }, () => Array(cols).fill(null));
}
function openSavePPForm() {

    const popupError = document.querySelector('.save-pp-popup-err-state');
    popupError.innerHTML = "";
    popupError.style.visibility = "hidden";

    //checking if nothing was added 
    let line = [];
    const something = newlyAdded[document.getElementById('select-pp').value].forEach(element => {
        //return element.every(el => el ===null);
        line.push(element.every(el => el === null));
    })
    const popup = document.getElementById("nothingAddedPopUp");
    if (line.every(element => element === true)) {
        if (!popup.classList.contains("show")) {
            popup.classList.toggle("show");
        }
        return;
    }
    else {
        if (popup.classList.contains("show")) {
            popup.classList.remove("show");
        }
    }
    document.getElementById('save-pp-popup').style.display = "block";

}
function closeSavePPForm() {
    document.getElementById('save-pp-popup').style.display = "none";
}
function openImportAlert() {
    document.styleSheets[0].cssRules[47].style.visibility = "visible";

    const no = document.getElementById('agree-button-no-1');
    no.addEventListener('click', () => {
        document.styleSheets[0].cssRules[47].style.visibility = "hidden";
    }, false);

    const yes = document.getElementById('agree-button-yes-1');
    yes.addEventListener('click', () => {
        document.styleSheets[0].cssRules[47].style.visibility = "hidden";
        importCSV();
    }, false);

}
function importCSV() {
    let fileInput = document.getElementById('csvFileInput');
    let file = fileInput.files[0];


    let reader = new FileReader();
    reader.onload = function (e) {
        let contents = e.target.result;
        let lines = contents.split('\n');

        let csvData = [];
        lines.forEach(function (line) {
            let rowData = line.split(',');
            let obj = {
                "faculty_code": rowData[0],
                "faculty_matrix_row_count": rowData[1],
                "faculty_matrix_col_count": rowData[2],
                "parking_space_number": rowData[3],
                "parking_cell_row": rowData[4],
                "parking_cell_col": rowData[5]
            };
            csvData.push(obj);
        });

        // Use the csvData array here for further processing
        console.log("importnato csv: \r\n", csvData);
        let faculties = {
            "fmi": false,
            "fhf": false,
            "fzf": false,
        };
        let faculties1 = {
            "fmi": [],
            "fhf": [],
            "fzf": [],
        };
        let faculties2 = {
            "fmi": 0,
            "fhf": 0,
            "fzf": 0,
        };
        // faculties1["fhf"][nomer_na_parkomqsto][index_na_dvoika_row_col]
        // faculties1["fhf"][3] = [];
        // faculties1["fhf"][3][0] = [5,6];
        // faculties1["fhf"][3][1] = [12,6];

        // faculties1["fhf"].forEach ( (el) => {
        //     console.log(el);
        // })

        for (let i = 1; i < csvData.length; i++) {

            faculties[csvData[i]["faculty_code"]] = [csvData[i]["faculty_matrix_row_count"], csvData[i]["faculty_matrix_col_count"]];

            const parknum = csvData[i]["parking_space_number"]
            if (parknum !== '') {
                if (!faculties1[csvData[i]["faculty_code"]]) {
                    faculties1[csvData[i]["faculty_code"]] = {};
                }

                if (!faculties1[csvData[i]["faculty_code"]][parknum]) {
                    faculties1[csvData[i]["faculty_code"]][parknum] = [];
                }
                faculties1[csvData[i]["faculty_code"]][parknum][faculties2[csvData[i]["faculty_code"]]] = [csvData[i]["parking_cell_row"], csvData[i]["parking_cell_col"]];
            } faculties2[csvData[i]["faculty_code"]] += 1;
        }

        console.log(faculties1);


        // Object.keys(faculties1["fzf"]).forEach((el) => {
        //         let number = el;
        //         let faculty_code= "fzf";
        //         let cells=[];
        //         let ind=0;
        //         faculties1["fzf"][el].forEach(element => {
        //             cells[ind]=[];
        //             cells[ind]=element;
        //             ind++;
        //         });
        //         const parkPlace = {
        //             "number": number,
        //             "faculty-code": faculty_code,
        //             "cells": cells,
        //         }
        //         fetch('../../backend/api/savingParkPlace.php', {
        //             method: 'POST',
        //             headers: {
        //                 'Content-Type': 'application/json',
        //             },
        //             body: JSON.stringify(parkPlace),
        //         })
        //             .then((httpData) => {
        //                 if (httpData.ok) {
        //                     return httpData.json();
        //                 }

        //                 return httpData.json().then(error => {
        //                     throw { error, url: httpData.url };
        //                 });
        //             })
        //             .then((data) => {
        //                 console.log(data);
        //             })
        //             .catch((error) => {
        //                 console.log(error);


        //             });
        // })


        let obj = {
            "faculty-code": "fzf"
        };
        let table = document.getElementById('fzf');
        let rows = faculties["fzf"][0];
        let cols = faculties["fzf"][1];

        //fzf
        fetch('../../backend/api/deleteAllParkCelssOfCertainFaculty.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(obj),
        })
            .then((httpData) => {
                if (httpData.ok) {
                    return httpData.json();
                }

                return httpData.json().then(error => {
                    throw { error, url: httpData.url };
                });
            })
            .then((data) => {
                fetch('../../backend/api/deleteAllReservationsOfCertainFaculty.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(obj),
                })
                    .then((httpData) => {
                        if (httpData.ok) {
                            return httpData.json();
                        }
                        return httpData.json().then(error => {
                            throw { error, url: httpData.url };
                        });
                    })
                    .then((data) => {
                        fetch('../../backend/api/deleteAllParkSpacesOfCertainFaculty.php', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify(obj),
                        })
                            .then((httpData) => {
                                if (httpData.ok) {
                                    return httpData.json();
                                }

                                return httpData.json().then(error => {
                                    throw { error, url: httpData.url };
                                });
                            })
                            .then((data) => {
                                console.log("ura");

                                const userData = {
                                    "row": rows,
                                    "col": cols,
                                    "faculty-code": table.id
                                };

                                fetch('../../backend/api/updateMatrixSize.php', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json',
                                    },
                                    body: JSON.stringify(userData),
                                })
                                    .then((httpData) => {
                                        if (httpData.ok) {
                                            return httpData.json();
                                        }

                                        return httpData.json().then(error => {
                                            throw { error, url: httpData.url };
                                        });
                                    })
                                    .then((data) => {
                                        console.log(data);
                                        table.innerHTML = "";
                                        for (let i = 0; i < rows; i++) {
                                            let current_row = table.insertRow(-1);
                                            for (let j = 0; j < cols; j++) {
                                                let current_cell = current_row.insertCell(-1);
                                                current_cell.classList.add("cell");
                                            }
                                        }

                                        //fmi 
                                        obj = {
                                            "faculty-code": "fmi"
                                        };
                                        table = document.getElementById('fmi');
                                        rows = faculties["fmi"][0];
                                        cols = faculties["fmi"][1];

                                        fetch('../../backend/api/deleteAllParkCelssOfCertainFaculty.php', {
                                            method: 'POST',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify(obj),
                                        })
                                            .then((httpData) => {
                                                if (httpData.ok) {
                                                    return httpData.json();
                                                }

                                                return httpData.json().then(error => {
                                                    throw { error, url: httpData.url };
                                                });
                                            })
                                            .then((data) => {
                                                fetch('../../backend/api/deleteAllReservationsOfCertainFaculty.php', {
                                                    method: 'POST',
                                                    headers: {
                                                        'Content-Type': 'application/json',
                                                    },
                                                    body: JSON.stringify(obj),
                                                })
                                                    .then((httpData) => {
                                                        if (httpData.ok) {
                                                            return httpData.json();
                                                        }
                                                        return httpData.json().then(error => {
                                                            throw { error, url: httpData.url };
                                                        });
                                                    })
                                                    .then((data) => {
                                                        fetch('../../backend/api/deleteAllParkSpacesOfCertainFaculty.php', {
                                                            method: 'POST',
                                                            headers: {
                                                                'Content-Type': 'application/json',
                                                            },
                                                            body: JSON.stringify(obj),
                                                        })
                                                            .then((httpData) => {
                                                                if (httpData.ok) {
                                                                    return httpData.json();
                                                                }

                                                                return httpData.json().then(error => {
                                                                    throw { error, url: httpData.url };
                                                                });
                                                            })
                                                            .then((data) => {
                                                                console.log("ura");

                                                                const userData = {
                                                                    "row": rows,
                                                                    "col": cols,
                                                                    "faculty-code": table.id
                                                                };

                                                                fetch('../../backend/api/updateMatrixSize.php', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                        'Content-Type': 'application/json',
                                                                    },
                                                                    body: JSON.stringify(userData),
                                                                })
                                                                    .then((httpData) => {
                                                                        if (httpData.ok) {
                                                                            return httpData.json();
                                                                        }

                                                                        return httpData.json().then(error => {
                                                                            throw { error, url: httpData.url };
                                                                        });
                                                                    })
                                                                    .then((data) => {
                                                                        console.log(data);
                                                                        table.innerHTML = "";
                                                                        for (let i = 0; i < rows; i++) {
                                                                            let current_row = table.insertRow(-1);
                                                                            for (let j = 0; j < cols; j++) {
                                                                                let current_cell = current_row.insertCell(-1);
                                                                                current_cell.classList.add("cell");
                                                                            }
                                                                        }



                                                                        //fhf
                                                                        obj = {
                                                                            "faculty-code": "fhf"
                                                                        };
                                                                        table = document.getElementById('fhf');
                                                                        rows = faculties["fhf"][0];
                                                                        cols = faculties["fhf"][1];

                                                                        fetch('../../backend/api/deleteAllParkCelssOfCertainFaculty.php', {
                                                                            method: 'POST',
                                                                            headers: {
                                                                                'Content-Type': 'application/json',
                                                                            },
                                                                            body: JSON.stringify(obj),
                                                                        })
                                                                            .then((httpData) => {
                                                                                if (httpData.ok) {
                                                                                    return httpData.json();
                                                                                }

                                                                                return httpData.json().then(error => {
                                                                                    throw { error, url: httpData.url };
                                                                                });
                                                                            })
                                                                            .then((data) => {
                                                                                fetch('../../backend/api/deleteAllReservationsOfCertainFaculty.php', {
                                                                                    method: 'POST',
                                                                                    headers: {
                                                                                        'Content-Type': 'application/json',
                                                                                    },
                                                                                    body: JSON.stringify(obj),
                                                                                })
                                                                                    .then((httpData) => {
                                                                                        if (httpData.ok) {
                                                                                            return httpData.json();
                                                                                        }
                                                                                        return httpData.json().then(error => {
                                                                                            throw { error, url: httpData.url };
                                                                                        });
                                                                                    })
                                                                                    .then((data) => {
                                                                                        fetch('../../backend/api/deleteAllParkSpacesOfCertainFaculty.php', {
                                                                                            method: 'POST',
                                                                                            headers: {
                                                                                                'Content-Type': 'application/json',
                                                                                            },
                                                                                            body: JSON.stringify(obj),
                                                                                        })
                                                                                            .then((httpData) => {
                                                                                                if (httpData.ok) {
                                                                                                    return httpData.json();
                                                                                                }

                                                                                                return httpData.json().then(error => {
                                                                                                    throw { error, url: httpData.url };
                                                                                                });
                                                                                            })
                                                                                            .then((data) => {
                                                                                                console.log("ura");

                                                                                                const userData = {
                                                                                                    "row": rows,
                                                                                                    "col": cols,
                                                                                                    "faculty-code": table.id
                                                                                                };

                                                                                                fetch('../../backend/api/updateMatrixSize.php', {
                                                                                                    method: 'POST',
                                                                                                    headers: {
                                                                                                        'Content-Type': 'application/json',
                                                                                                    },
                                                                                                    body: JSON.stringify(userData),
                                                                                                })
                                                                                                    .then((httpData) => {
                                                                                                        if (httpData.ok) {
                                                                                                            return httpData.json();
                                                                                                        }

                                                                                                        return httpData.json().then(error => {
                                                                                                            throw { error, url: httpData.url };
                                                                                                        });
                                                                                                    })
                                                                                                    .then((data) => {
                                                                                                        console.log(data);
                                                                                                        table.innerHTML = "";
                                                                                                        for (let i = 0; i < rows; i++) {
                                                                                                            let current_row = table.insertRow(-1);
                                                                                                            for (let j = 0; j < cols; j++) {
                                                                                                                let current_cell = current_row.insertCell(-1);
                                                                                                                current_cell.classList.add("cell");
                                                                                                            }
                                                                                                        }
                                                                                                        Object.keys(faculties1["fzf"]).forEach((el) => {
                                                                                                            let number = el;
                                                                                                            let faculty_code = "fzf";
                                                                                                            let cells = [];
                                                                                                            let ind = 0;
                                                                                                            faculties1["fzf"][el].forEach(element => {
                                                                                                                cells[ind] = [];
                                                                                                                cells[ind] = element;
                                                                                                                ind++;
                                                                                                            });
                                                                                                            const parkPlace = {
                                                                                                                "number": number,
                                                                                                                "faculty-code": faculty_code,
                                                                                                                "cells": cells,
                                                                                                            }
                                                                                                            fetch('../../backend/api/savingParkPlace.php', {
                                                                                                                method: 'POST',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                body: JSON.stringify(parkPlace),
                                                                                                            })
                                                                                                                .then((httpData) => {
                                                                                                                    if (httpData.ok) {
                                                                                                                        return httpData.json();
                                                                                                                    }

                                                                                                                    return httpData.json().then(error => {
                                                                                                                        throw { error, url: httpData.url };
                                                                                                                    });
                                                                                                                })
                                                                                                                .then((data) => {
                                                                                                                    console.log(data);
                                                                                                                })
                                                                                                                .catch((error) => {
                                                                                                                    console.log(error);
                                                                                                                });
                                                                                                        });
                                                                                                         Object.keys(faculties1["fmi"]).forEach((el) => {
                                                                                                            let number = el;
                                                                                                            let faculty_code = "fmi";
                                                                                                            let cells = [];
                                                                                                            let ind = 0;
                                                                                                            faculties1["fmi"][el].forEach(element => {
                                                                                                                cells[ind] = [];
                                                                                                                cells[ind] = element;
                                                                                                                ind++;
                                                                                                            });
                                                                                                            const parkPlace = {
                                                                                                                "number": number,
                                                                                                                "faculty-code": faculty_code,
                                                                                                                "cells": cells,
                                                                                                            }
                                                                                                            fetch('../../backend/api/savingParkPlace.php', {
                                                                                                                method: 'POST',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                body: JSON.stringify(parkPlace),
                                                                                                            })
                                                                                                                .then((httpData) => {
                                                                                                                    if (httpData.ok) {
                                                                                                                        return httpData.json();
                                                                                                                    }

                                                                                                                    return httpData.json().then(error => {
                                                                                                                        throw { error, url: httpData.url };
                                                                                                                    });
                                                                                                                })
                                                                                                                .then((data) => {
                                                                                                                    console.log(data);
                                                                                                                })
                                                                                                                .catch((error) => {
                                                                                                                    console.log(error);
                                                                                                                });
                                                                                                        })

                                                                                                        Object.keys(faculties1["fhf"]).forEach((el) => {
                                                                                                            let number = el;
                                                                                                            let faculty_code = "fhf";
                                                                                                            let cells = [];
                                                                                                            let ind = 0;
                                                                                                            faculties1["fhf"][el].forEach(element => {
                                                                                                                cells[ind] = [];
                                                                                                                cells[ind] = element;
                                                                                                                ind++;
                                                                                                            });
                                                                                                            const parkPlace = {
                                                                                                                "number": number,
                                                                                                                "faculty-code": faculty_code,
                                                                                                                "cells": cells,
                                                                                                            }
                                                                                                            fetch('../../backend/api/savingParkPlace.php', {
                                                                                                                method: 'POST',
                                                                                                                headers: {
                                                                                                                    'Content-Type': 'application/json',
                                                                                                                },
                                                                                                                body: JSON.stringify(parkPlace),
                                                                                                            })
                                                                                                                .then((httpData) => {
                                                                                                                    if (httpData.ok) {
                                                                                                                        return httpData.json();
                                                                                                                    }

                                                                                                                    return httpData.json().then(error => {
                                                                                                                        throw { error, url: httpData.url };
                                                                                                                    });
                                                                                                                })
                                                                                                                .then((data) => {
                                                                                                                    console.log(data);
                                                                                                                })
                                                                                                                .catch((error) => {
                                                                                                                    console.log(error);
                                                                                                                });
                                                                                                        })





                                                                                                    })
                                                                                                    .catch((error) => {
                                                                                                        console.log(error);
                                                                                                    });
                                                                                            })
                                                                                            .catch((error) => {
                                                                                                console.log(error);
                                                                                            });

                                                                                    })
                                                                                    .catch((error) => {
                                                                                        console.log(error);
                                                                                    });

                                                                            })
                                                                            .catch((error) => {
                                                                                console.log(error);
                                                                            });


                                                                    })
                                                                    .catch((error) => {
                                                                        console.log(error);
                                                                    });
                                                            })
                                                            .catch((error) => {
                                                                console.log(error);
                                                            });

                                                    })
                                                    .catch((error) => {
                                                        console.log(error);
                                                    });

                                            })
                                            .catch((error) => {
                                                console.log(error);
                                            });

                                    })
                                    .catch((error) => {
                                        console.log(error);
                                    });
                            })
                            .catch((error) => {
                                console.log(error);
                            });

                    })
                    .catch((error) => {
                        console.log(error);
                    });

            })
            .catch((error) => {
                console.log(error);
            });

    };
    setTimeout(() => {
        window.location.href='./home.html';
      }, "3000");
    reader.readAsText(file);
}
function exportCSV() {
    let csvContent = "data:text/csv;charset=utf-8,";


    // Generate your CSV data here
    fetch('../../backend/api/getExportData.php')
        .then((httpData) => {
            if (httpData.ok) {
                return httpData.json();
            }

            return httpData.json().then(error => {
                throw { error, url: httpData.url };
            });
        })
        .then((data) => {
            //console.log("exportnata data \n" , data);
            let csvData = [
                ['faculty_code', 'faculty_matrix_row_count', 'faculty_matrix_col_count', 'parking_space_number', 'parking_cell_row', 'parking_cell_col'],
            ];
            data.forEach((row) => {
                csvData.push([row["code"], row["matrix_row_length"], row["matrix_col_length"], row["number"], row["row"], row["col"]]);
            })
            //console.log(csvData);

            csvData.forEach(function (rowArray) {
                let row = rowArray.join(",");
                csvContent += row + "\n";
            });

            // Create a temporary link element
            let link = document.createElement("a");
            link.setAttribute("href", encodeURI(csvContent));
            link.setAttribute("download", "data.csv");
            document.body.appendChild(link);

            // Simulate a click event to trigger the download
            link.click();

            // Clean up
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.log(error);
        });


}
let newlyAdded = {};
window.addEventListener('load', () => {
    fetch('../../backend/api/getMatrixSize.php')
        .then((httpData) => {
            if (httpData.ok) {
                return httpData.json();
            }

            return httpData.json().then(error => {
                throw { error, url: httpData.url };
            });
        })
        .then((data) => {
            console.log(data);
            data.forEach((el) => {
                const faculty = document.getElementById(`${el["code"]}`);
                faculty.innerHTML = "";
                for (let i = 0; i < el["matrix_row_length"]; i++) {
                    let current_row = faculty.insertRow(-1);
                    for (let j = 0; j < el["matrix_col_length"]; j++) {
                        let current_cell = current_row.insertCell(-1);
                        current_cell.classList.add("cell");
                    }
                }
            })

            newlyAdded = {
                "fhf": createEmptyMatrix(document.getElementById('fhf').rows.length, document.getElementById('fhf').rows[0].cells.length),
                "fmi": createEmptyMatrix(document.getElementById('fmi').rows.length, document.getElementById('fmi').rows[0].cells.length),
                "fzf": createEmptyMatrix(document.getElementById('fzf').rows.length, document.getElementById('fzf').rows[0].cells.length),
            };


            fetch('../../backend/api/getCellsInfo.php')
                .then((httpData) => {
                    if (httpData.ok) {
                        return httpData.json();
                    }

                    return httpData.json().then(error => {
                        throw { error, url: httpData.url };
                    });
                })
                .then((data) => {
                    console.log(data);
                    data.forEach((cell) => {
                        const table = document.getElementById(cell["code"]);
                        table.rows[parseInt(cell["row"])].cells[parseInt(cell["col"])].innerHTML = `${cell["number"]}`;
                        table.rows[parseInt(cell["row"])].cells[parseInt(cell["col"])].style.background = "red";
                    })
                })
                .catch((error) => {
                    console.log(error);
                });


        })
        .catch((error) => {
            console.log(error);
        });



})

const matrixChange = document.getElementById('matrix-change');
matrixChange.addEventListener('submit', (event) => {
    event.preventDefault();
    const select = document.getElementById("selected");
    const rows_value = document.getElementById("matrix-change-row").value;
    const cols_value = document.getElementById("matrix-change-col").value;
    console.log(rows_value, cols_value);
    const selected_table = document.getElementById(select.value);
    changeMatrix(selected_table, rows_value, cols_value);

});


const createPPButton = document.getElementById('create-pp');
createPPButton.addEventListener('click', createParkPlace, false);

const savePPButton = document.getElementById('save-pp');
savePPButton.addEventListener('click', openSavePPForm, false);

const savePPForm = document.getElementById('save-pp-form');
savePPForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const number = document.getElementById('pp-number');
    saveParkPlace(number.value);
    number.value = "";
})
const nothingAddedPopUp = document.getElementById('nothingAddedPopUp');
nothingAddedPopUp.addEventListener('click', () => {
    nothingAddedPopUp.classList.toggle("show");
}, false);

const cancelSave = document.getElementById('cancel-save-pp');
cancelSave.addEventListener('click', cancelSavePP, false);

const exportButton = document.getElementById('export-btn');
exportButton.addEventListener('click', exportCSV, false);

const importForm = document.getElementById('import-form');
importForm.addEventListener('submit', (event) => {
    event.preventDefault();
    openImportAlert();
}, false);
