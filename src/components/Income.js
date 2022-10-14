import React from "react";

function Income({ income }){

    return (
        <div>
            Income
            <form>
                <p>Current monthly income is ${income}</p>
                <label>
                    Update Income:
                    <input type='text' name="name" />
                </label>
                <button type="submit">Update</button>
            </form>
        </div>
    )
}

export default Income;