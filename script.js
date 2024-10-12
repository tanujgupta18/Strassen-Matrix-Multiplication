function showTheory() {
    alert(
        " Steps For Strassens Matrix Multiplication:\n" +
        "P1: A11(B12 - B22)\n" +
        "P2: (A11 + A12) B22\n" +
        "P3: (A21 + A22) B11\n" +
        "P4: A22(B21 - B11)\n" +
        "P5: (A11 + A22)(B11 + B22)\n" +
        "P6: (A12 - A22)(B21 + B22)\n" +
        "P7: (A11 - A21)(B11 + B12)\n" +
        "Combining Products\n" +
        "C11: P5 + P4 - P2 + P6\n" +
        "C12: P1 + P2\n" +
        "C21: P3 + P4\n" +
        "C22: P5 + P1 - P3 - P7"
    );
}

function splitMatrices() {
    // Retrieve the values from the inputs for Matrix A
    const A = [
        [
            parseInt(document.getElementById("a00").value),
            parseInt(document.getElementById("a01").value),
            parseInt(document.getElementById("a02").value),
            parseInt(document.getElementById("a03").value)
        ],
        [
            parseInt(document.getElementById("a10").value),
            parseInt(document.getElementById("a11").value),
            parseInt(document.getElementById("a12").value),
            parseInt(document.getElementById("a13").value)
        ],
        [
            parseInt(document.getElementById("a20").value),
            parseInt(document.getElementById("a21").value),
            parseInt(document.getElementById("a22").value),
            parseInt(document.getElementById("a23").value)
        ],
        [
            parseInt(document.getElementById("a30").value),
            parseInt(document.getElementById("a31").value),
            parseInt(document.getElementById("a32").value),
            parseInt(document.getElementById("a33").value)
        ]
    ];

    // Retrieve the values from the inputs for Matrix B
    const B = [
        [
            parseInt(document.getElementById("b00").value),
            parseInt(document.getElementById("b01").value),
            parseInt(document.getElementById("b02").value),
            parseInt(document.getElementById("b03").value)
        ],
        [
            parseInt(document.getElementById("b10").value),
            parseInt(document.getElementById("b11").value),
            parseInt(document.getElementById("b12").value),
            parseInt(document.getElementById("b13").value)
        ],
        [
            parseInt(document.getElementById("b20").value),
            parseInt(document.getElementById("b21").value),
            parseInt(document.getElementById("b22").value),
            parseInt(document.getElementById("b23").value)
        ],
        [
            parseInt(document.getElementById("b30").value),
            parseInt(document.getElementById("b31").value),
            parseInt(document.getElementById("b32").value),
            parseInt(document.getElementById("b33").value)
        ]
    ];

    const A11 = [[A[0][0], A[0][1]], [A[1][0], A[1][1]]];
    const A12 = [[A[0][2], A[0][3]], [A[1][2], A[1][3]]];
    const A21 = [[A[2][0], A[2][1]], [A[3][0], A[3][1]]];
    const A22 = [[A[2][2], A[2][3]], [A[3][2], A[3][3]]];

    const B11 = [[B[0][0], B[0][1]], [B[1][0], B[1][1]]];
    const B12 = [[B[0][2], B[0][3]], [B[1][2], B[1][3]]];
    const B21 = [[B[2][0], B[2][1]], [B[3][0], B[3][1]]];
    const B22 = [[B[2][2], B[2][3]], [B[3][2], B[3][3]]];

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `
        <div>
            <strong>A11</strong>
            ${generateTable(A11)}
        </div>
        <div>
            <strong>A12</strong>
            ${generateTable(A12)}
        </div>
        <div>
            <strong>A21</strong>
            ${generateTable(A21)}
        </div>
        <div>
            <strong>A22</strong>
            ${generateTable(A22)}
        </div>
        <div>
            <strong>B11</strong>
            ${generateTable(B11)}
        </div>
        <div>
            <strong>B12</strong>
            ${generateTable(B12)}
        </div>
        <div>
            <strong>B21</strong>
            ${generateTable(B21)}
        </div>
        <div>
            <strong>B22</strong>
            ${generateTable(B22)}
        </div>
    `;
}

function generateTable(matrix) {
    let tableHTML = '<table><tbody>';
    for (let i = 0; i < matrix.length; i++) {
        tableHTML += '<tr>';
        for (let j = 0; j < matrix[i].length; j++) {
            tableHTML += `<td>${matrix[i][j]}</td>`;
        }
        tableHTML += '</tr>';
    }
    tableHTML += '</tbody></table>';
    return tableHTML;
}

// Add the Strassen Matrix Multiplication function
function strassenMultiplication() {
    // Helper function for matrix addition
    function addMatrices(A, B) {
        return A.map((row, i) => row.map((val, j) => val + B[i][j]));
    }

    // Helper function for matrix subtraction
    function subtractMatrices(A, B) {
        return A.map((row, i) => row.map((val, j) => val - B[i][j]));
    }

    // Strassen's Matrix Multiplication Recursive Algorithm
    function strassen(A, B) {
        if (A.length === 1) {
            return [[A[0][0] * B[0][0]]];
        }

        const mid = A.length / 2;

        const A11 = A.slice(0, mid).map(row => row.slice(0, mid));
        const A12 = A.slice(0, mid).map(row => row.slice(mid));
        const A21 = A.slice(mid).map(row => row.slice(0, mid));
        const A22 = A.slice(mid).map(row => row.slice(mid));

        const B11 = B.slice(0, mid).map(row => row.slice(0, mid));
        const B12 = B.slice(0, mid).map(row => row.slice(mid));
        const B21 = B.slice(mid).map(row => row.slice(0, mid));
        const B22 = B.slice(mid).map(row => row.slice(mid));

        const M1 = strassen(addMatrices(A11, A22), addMatrices(B11, B22));
        const M2 = strassen(addMatrices(A21, A22), B11);
        const M3 = strassen(A11, subtractMatrices(B12, B22));
        const M4 = strassen(A22, subtractMatrices(B21, B11));
        const M5 = strassen(addMatrices(A11, A12), B22);
        const M6 = strassen(subtractMatrices(A21, A11), addMatrices(B11, B12));
        const M7 = strassen(subtractMatrices(A12, A22), addMatrices(B21, B22));

        const C11 = addMatrices(subtractMatrices(addMatrices(M1, M4), M5), M7);
        const C12 = addMatrices(M3, M5);
        const C21 = addMatrices(M2, M4);
        const C22 = addMatrices(subtractMatrices(addMatrices(M1, M3), M2), M6);

        const C = [];

        for (let i = 0; i < mid; i++) {
            C.push([...C11[i], ...C12[i]]);
        }
        for (let i = 0; i < mid; i++) {
            C.push([...C21[i], ...C22[i]]);
        }

        return C;
    }

    const A = [
        [
            parseInt(document.getElementById("a00").value),
            parseInt(document.getElementById("a01").value),
            parseInt(document.getElementById("a02").value),
            parseInt(document.getElementById("a03").value)
        ],
        [
            parseInt(document.getElementById("a10").value),
            parseInt(document.getElementById("a11").value),
            parseInt(document.getElementById("a12").value),
            parseInt(document.getElementById("a13").value)
        ],
        [
            parseInt(document.getElementById("a20").value),
            parseInt(document.getElementById("a21").value),
            parseInt(document.getElementById("a22").value),
            parseInt(document.getElementById("a23").value)
        ],
        [
            parseInt(document.getElementById("a30").value),
            parseInt(document.getElementById("a31").value),
            parseInt(document.getElementById("a32").value),
            parseInt(document.getElementById("a33").value)
        ]
    ];

    const B = [
        [
            parseInt(document.getElementById("b00").value),
            parseInt(document.getElementById("b01").value),
            parseInt(document.getElementById("b02").value),
            parseInt(document.getElementById("b03").value)
        ],
        [
            parseInt(document.getElementById("b10").value),
            parseInt(document.getElementById("b11").value),
            parseInt(document.getElementById("b12").value),
            parseInt(document.getElementById("b13").value)
        ],
        [
            parseInt(document.getElementById("b20").value),
            parseInt(document.getElementById("b21").value),
            parseInt(document.getElementById("b22").value),
            parseInt(document.getElementById("b23").value)
        ],
        [
            parseInt(document.getElementById("b30").value),
            parseInt(document.getElementById("b31").value),
            parseInt(document.getElementById("b32").value),
            parseInt(document.getElementById("b33").value)
        ]
    ];

    const result = strassen(A, B);

    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = `<div><strong>Result</strong>${generateTable(result)}</div>`;
}
