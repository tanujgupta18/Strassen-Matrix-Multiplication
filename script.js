document.addEventListener("DOMContentLoaded", function () {
  const size = 3; // Matrix size (3x3)
  createMatrixInputs("matrixA", size);
  createMatrixInputs("matrixB", size);

  document
    .getElementById("multiplyButton")
    .addEventListener("click", function () {
      const matrixA = getMatrixValues("matrixA", size);
      const matrixB = getMatrixValues("matrixB", size);

      if (
        matrixA.length !== matrixB.length ||
        matrixA[0].length !== matrixB[0].length
      ) {
        alert(
          "Matrices must be of the same size and square for Strassen's algorithm."
        );
        return;
      }

      // Pad matrices to 4x4
      const paddedA = padMatrix(matrixA, 4);
      const paddedB = padMatrix(matrixB, 4);

      const result = strassenMultiply(paddedA, paddedB);

      // Extract the top-left 3x3 matrix from the result
      const trimmedResult = trimMatrix(result, 3);
      displayResultMatrix(trimmedResult, "resultMatrix");
    });
});

// Creates input fields for a matrix
function createMatrixInputs(containerId, size) {
  const container = document.getElementById(containerId);
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.innerHTML = "";

  // Create input fields in a grid
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const input = document.createElement("input");
      input.type = "number";
      input.value = 0; // Default value
      container.appendChild(input);
    }
  }
}

// Retrieves matrix values from input fields
function getMatrixValues(containerId, size) {
  const container = document.getElementById(containerId);
  const inputs = container.getElementsByTagName("input");
  const matrix = [];

  // Extract values from input fields
  for (let i = 0; i < size; i++) {
    const row = [];
    for (let j = 0; j < size; j++) {
      row.push(parseFloat(inputs[i * size + j].value));
    }
    matrix.push(row);
  }

  return matrix;
}

// Displays the result matrix
function displayResultMatrix(matrix, containerId) {
  const size = matrix.length;
  const container = document.getElementById(containerId);
  container.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
  container.innerHTML = "";

  // Display matrix values in a grid
  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      const cell = document.createElement("div");
      cell.textContent = matrix[i][j];
      container.appendChild(cell);
    }
  }
}

// Pads a matrix to a larger size by filling with zeros
function padMatrix(matrix, newSize) {
  const paddedMatrix = new Array(newSize)
    .fill(0)
    .map(() => new Array(newSize).fill(0));

  for (let i = 0; i < matrix.length; i++) {
    for (let j = 0; j < matrix[0].length; j++) {
      paddedMatrix[i][j] = matrix[i][j];
    }
  }

  return paddedMatrix;
}

// Trims a padded matrix back to its original size
function trimMatrix(matrix, originalSize) {
  const trimmedMatrix = new Array(originalSize)
    .fill(0)
    .map(() => new Array(originalSize).fill(0));

  for (let i = 0; i < originalSize; i++) {
    for (let j = 0; j < originalSize; j++) {
      trimmedMatrix[i][j] = matrix[i][j];
    }
  }

  return trimmedMatrix;
}

// Adds two matrices
function addMatrices(A, B) {
  const n = A.length;
  const C = new Array(n).fill(0).map(() => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] + B[i][j];
    }
  }
  return C;
}

// Subtracts matrix B from matrix A
function subtractMatrices(A, B) {
  const n = A.length;
  const C = new Array(n).fill(0).map(() => new Array(n).fill(0));
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      C[i][j] = A[i][j] - B[i][j];
    }
  }
  return C;
}

// Strassen's matrix multiplication algorithm
function strassenMultiply(A, B) {
  const n = A.length;

  // Base case for recursion
  if (n === 1) {
    return [[A[0][0] * B[0][0]]];
  }

  const k = Math.floor(n / 2);

  // Divide matrices into quarters
  const A11 = A.slice(0, k).map((row) => row.slice(0, k));
  const A12 = A.slice(0, k).map((row) => row.slice(k));
  const A21 = A.slice(k).map((row) => row.slice(0, k));
  const A22 = A.slice(k).map((row) => row.slice(k));

  const B11 = B.slice(0, k).map((row) => row.slice(0, k));
  const B12 = B.slice(0, k).map((row) => row.slice(k));
  const B21 = B.slice(k).map((row) => row.slice(0, k));
  const B22 = B.slice(k).map((row) => row.slice(k));

  // Strassen's submatrices
  const M1 = strassenMultiply(addMatrices(A11, A22), addMatrices(B11, B22));
  const M2 = strassenMultiply(addMatrices(A21, A22), B11);
  const M3 = strassenMultiply(A11, subtractMatrices(B12, B22));
  const M4 = strassenMultiply(A22, subtractMatrices(B21, B11));
  const M5 = strassenMultiply(addMatrices(A11, A12), B22);
  const M6 = strassenMultiply(
    subtractMatrices(A21, A11),
    addMatrices(B11, B12)
  );
  const M7 = strassenMultiply(
    subtractMatrices(A12, A22),
    addMatrices(B21, B22)
  );

  // Combine submatrices to get the result
  const C11 = addMatrices(subtractMatrices(addMatrices(M1, M4), M5), M7);
  const C12 = addMatrices(M3, M5);
  const C21 = addMatrices(M2, M4);
  const C22 = addMatrices(subtractMatrices(addMatrices(M1, M3), M2), M6);

  const C = new Array(n).fill(0).map(() => new Array(n).fill(0));
  for (let i = 0; i < k; i++) {
    for (let j = 0; j < k; j++) {
      C[i][j] = C11[i][j];
      C[i][j + k] = C12[i][j];
      C[i + k][j] = C21[i][j];
      C[i + k][j + k] = C22[i][j];
    }
  }

  return C;
}
