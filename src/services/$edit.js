
export function $edit($apply) {
    this.edit = (item) => {
        this.ref = item;
        this.item = JSON.parse(JSON.stringify(item));
        $apply();
    }

    this.save = () => {
        Object.assign(this.ref, this.item);
        this.ref = null;
        this.item = null;
        $apply();
    }

    this.cancel = () => {
        this.ref = null;
        this.item = null;
        $apply();
    }
}
$edit.$id = '$edit';