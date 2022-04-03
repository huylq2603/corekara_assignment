import React, { Component } from "react";
import styles from "./PostCodeInput.module.css"

class PostCodeInput extends Component {

    state = {
        postCode: "",
        isJapanPostCode: false,
    }

    handlePostCodeChange = (e) => {
        let postCode = e.target.value;

        //check every time post code is changed
        let isJapanPostCode = this.isJapanPostCode(postCode);

        this.setState({
            postCode,
            isJapanPostCode,
        })
    }

    //use regex to check japan post code format
    isJapanPostCode = (postCode) => {
        let jpPostCodeRegex = /^〒?[0-9]{3}-?[0-9]{4}$/g;
        if (!jpPostCodeRegex.test(postCode)) {
            return false;
        }
        return true;
    }

    render() {
        return (
            <div className={styles.postCodeInput}>
                <span>Post Code</span>
                <input type="text" name="postCode" onChange={this.handlePostCodeChange} />
                <button disabled={!this.state.isJapanPostCode} onClick={() => this.props.getInfoByPostCode(this.state.postCode)}>Submit</button>
            </div>
        )
    }

}

export default PostCodeInput;