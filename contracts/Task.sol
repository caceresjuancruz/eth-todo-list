// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract TaskContract {
    event AddTask(address recipient, uint256 taskId);
    event DeleteTask(uint256 taskId, bool isDeleted );

    struct Task {
        uint256 id;
        string taskText;
        bool isDeleted;
    }

    Task[] private tasks;

    mapping(address => uint256) ownerToTask;    
    mapping(uint256 => address) taskToOwner;

    function addTask(string memory _taskText) external {
        uint256 _taskId = tasks.length;
        tasks.push(Task(_taskId, _taskText, false));
        ownerToTask[msg.sender] = _taskId;
        taskToOwner[_taskId] = msg.sender; 
        emit AddTask(msg.sender, _taskId);
    }

    function deleteTask(uint256 _taskId) external {
        if(taskToOwner[_taskId] == msg.sender){
            tasks[_taskId].isDeleted = true;
            emit DeleteTask(_taskId, tasks[_taskId].isDeleted);
        }
    }

    function getTasks() external view returns(Task[] memory){
        Task[] memory myTasks = new Task[](tasks.length);
        uint256 counter = 0;
        for (uint i=0; i<tasks.length; i++){
            if(taskToOwner[i] == msg.sender && tasks[i].isDeleted == false){
                myTasks[counter] = (tasks[i]);
                counter++;
            }
        }
        Task[] memory result = new Task[](counter);
        for (uint i=0; i<counter; i++){
            result[i] = myTasks[i];
        }
        return result;
    }
}