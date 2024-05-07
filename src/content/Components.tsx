import { Component } from 'solid-js';


export function Row(props:{ children: any }) {
    return (
        <div class='grid auto-cols-fr grid-flow-col first:border-b'>
            {props.children}
        </div>
    )
}