import React from 'react';
import { TextField, DefaultButton, PrimaryButton } from '@fluentui/react';
import { Modal } from '../Modal';
import { useService } from 'use-service';

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
        <Modal isOpen onClose={() => $edit.cancel()}>
            <Modal.Header><h4>Edit Entry</h4></Modal.Header>
            <Modal.Body>
                <form noValidate>
                    <fieldset>
                        <legend>Request</legend>
                        <TextField label="Method" defaultValue={req.method} onChange={(e, v) => updateField('request.method', v)} />
                        <TextField label="URL" defaultValue={req.url} onChange={(e, v) => updateField('request.url', v)} />
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
            </Modal.Body>
            <Modal.Footer>
                <PrimaryButton text="Save" onClick={() => $edit.save()} style={{ marginLeft: 8 }} />
                <DefaultButton text="Cancel" onClick={() => $edit.cancel()} />
            </Modal.Footer>
        </Modal>
    );
}
