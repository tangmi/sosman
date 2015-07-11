
export class Timer {
	constructor() {
		this.start = +new Date;
	}

	elapsed() {
		return (+new Date) - this.start;
	}
}
