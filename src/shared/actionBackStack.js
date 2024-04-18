export class BackStack {
    backStack = [];
    pushAction = (type, snapshot) => {
        this.backStack.push({
            action: type,
            snapshot: [...snapshot]
        })
    }

    canBack = () => {
        return this.backStack.length > 0;
    }

    popAction = () => {
        if(this.canBack()) {
            return this.backStack.pop();
        }
        return [];
    }

    clear = () => {
        this.backStack = [];
    }

}