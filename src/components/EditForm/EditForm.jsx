import React from 'react';
import { TextField, DefaultButton, PrimaryButton, IconButton } from '@fluentui/react';
import { useService } from 'use-service';
import './EditForm.css';

export function EditForm() {
    const $edit = useService('$edit');
    const data = $edit.item;
    if (!data) {
        return null;
    }

    const updateField = (path, value) => {
        const parts = path.split('.');
        let obj = $edit.item;
        for (let i = 0; i < parts.length - 1; i++) {
            obj = obj[parts[i]];
        }
        obj[parts[parts.length - 1]] = value;
    };

    const req = data.request;
    const res = data.response;
    return (
        <div className="edit-panel">
            <div className="edit-panel-header">
                <h4 style={{ margin: 0 }}>Edit Entry</h4>
                <IconButton iconProps={{ iconName: 'Cancel' }} onClick={() => $edit.cancel()} title="Close" />
            </div>
            <div className="edit-panel-body">
                <form noValidate>
                    <fieldset>
                        <legend>Request</legend>
                        <TextField label="Method" defaultValue={req.method} onChange={(e, v) => updateField('request.method', v)} />
                        <TextField label="URL" defaultValue={req.url} onChange={(e, v) => updateField('request.url', v)} multiline autoAdjustHeight />
                    </fieldset>
                    <fieldset>
                        <legend>Response</legend>
                        <TextField label="Status" defaultValue={String(res.status)} onChange={(e, v) => updateField('response.status', Number(v))} type="number" />
                        <TextField label="Status Text" defaultValue={res.statusText} onChange={(e, v) => updateField('response.statusText', v)} />
                        <TextField label="HTTP Version" defaultValue={res.httpVersion} onChange={(e, v) => updateField('response.httpVersion', v)} />
                        <TextField label="Content Size" defaultValue={String(res.content.size)} onChange={(e, v) => updateField('response.content.size', Number(v))} type="number" />
                        <TextField label="MIME Type" defaultValue={res.content.mimeType} onChange={(e, v) => updateField('response.content.mimeType', v)} />
                    </fieldset>
                </form>
            </div>
            <div className="edit-panel-footer">
                <PrimaryButton text="Save" onClick={() => $edit.save()} style={{ marginRight: 8 }} />
                <DefaultButton text="Cancel" onClick={() => $edit.cancel()} />
            </div>
        </div>
    );
}
