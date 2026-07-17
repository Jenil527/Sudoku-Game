#include <iostream>
#include <vector>
#include <algorithm>
#include <random>
#include <chrono>
#include <string>

using namespace std;

// Check if placing num at board[row][col] is valid
bool isValid(const vector<vector<int>>& board, int row, int col, int num) {
    for (int i = 0; i < 9; i++) {
        if (board[row][i] == num) return false;
        if (board[i][col] == num) return false;
        int boxRow = (row / 3) * 3 + i / 3;
        int boxCol = (col / 3) * 3 + i % 3;
        if (board[boxRow][boxCol] == num) return false;
    }
    return true;
}

// Fill board completely
bool fillBoard(vector<vector<int>>& board, mt19937& g) {
    for (int i = 0; i < 81; i++) {
        int row = i / 9;
        int col = i % 9;
        if (board[row][col] == 0) {
            vector<int> numbers = {1, 2, 3, 4, 5, 6, 7, 8, 9};
            shuffle(numbers.begin(), numbers.end(), g);
            for (int num : numbers) {
                if (isValid(board, row, col, num)) {
                    board[row][col] = num;
                    if (fillBoard(board, g)) {
                        return true;
                    }
                    board[row][col] = 0;
                }
            }
            return false;
        }
    }
    return true;
}

// Count solutions to check uniqueness
void solve(vector<vector<int>>& b, int& count, int limit) {
    for (int i = 0; i < 81; i++) {
        int row = i / 9;
        int col = i % 9;
        if (b[row][col] == 0) {
            for (int num = 1; num <= 9; num++) {
                if (isValid(b, row, col, num)) {
                    b[row][col] = num;
                    solve(b, count, limit);
                    if (count >= limit) return;
                    b[row][col] = 0;
                }
            }
            return;
        }
    }
    count++;
}

int countSolutions(vector<vector<int>> board, int limit = 2) {
    int count = 0;
    solve(board, count, limit);
    return count;
}

int main(int argc, char* argv[]) {
    int difficulty = 40;
    if (argc > 1) {
        difficulty = stoi(argv[1]);
    }
    
    random_device rd;
    mt19937 g(rd());
    
    vector<vector<int>> board(9, vector<int>(9, 0));
    fillBoard(board, g);
    
    vector<vector<int>> solution = board;
    
    vector<int> cells(81);
    for (int i = 0; i < 81; i++) cells[i] = i;
    shuffle(cells.begin(), cells.end(), g);
    
    int cellsToRemove = min(difficulty, 64);
    for (int cell : cells) {
        if (cellsToRemove <= 0) break;
        int row = cell / 9;
        int col = cell % 9;
        
        int backup = board[row][col];
        board[row][col] = 0;
        
        if (countSolutions(board, 2) != 1) {
            board[row][col] = backup;
        } else {
            cellsToRemove--;
        }
    }
    
    // Output JSON
    cout << "{\"puzzle\":[";
    for(int r=0; r<9; ++r) {
        cout << "[";
        for(int c=0; c<9; ++c) {
            cout << board[r][c] << (c<8?",":"");
        }
        cout << "]" << (r<8?",":"");
    }
    cout << "],\"solution\":[";
    for(int r=0; r<9; ++r) {
        cout << "[";
        for(int c=0; c<9; ++c) {
            cout << solution[r][c] << (c<8?",":"");
        }
        cout << "]" << (r<8?",":"");
    }
    cout << "]}" << endl;
    
    return 0;
}
