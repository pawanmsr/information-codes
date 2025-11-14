import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Markers } from './utils/markers';
import { Analyzer } from './utils/analyzer';
import { ErrorCorrection } from './utils/error';
import { Matrix } from './utils/matrix';
import { ERROR_CORRECTION_LEVEL, QUIET_ZONE_SIZE, VERSION } from './utils/constants';
import { Color } from './utils/types';
import { identifierLevel } from './utils/tables';

@Component({
  selector: 'ngx-quick-response-code',
  template: `<canvas #code></canvas>`,
  styles: ``,
})
export class QuickResponseCode implements AfterViewInit {
  @Input() text: string = "HELLO WORLD"
  @Input() quietZoneSize: number = QUIET_ZONE_SIZE;
  @Input() minimumVersion: number = VERSION.MIN;
  @Input() minimumErrorLevel: string = ERROR_CORRECTION_LEVEL.L;

  @ViewChild('code', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  ngAfterViewInit(): void {
    let analyzer: Analyzer = new Analyzer(this.text);
    analyzer.setMinimumVersionAndLevel(this.minimumVersion,
      identifierLevel(this.minimumErrorLevel));

    let markers: Markers = new Markers(analyzer.getVersion());
    let correction: ErrorCorrection = new ErrorCorrection(
      analyzer.getVersion(), analyzer.getLevel(), analyzer.getBlocks());
    let matrix: Matrix = new Matrix(markers.size(), this.quietZoneSize);

    markers.finderPatterns().forEach(center => {
      matrix.placeFinderPattern(center)
    });

    markers.alignmentPatterns().forEach(center => {
      matrix.placeAlignmentPattern(center);
    });

    matrix.addTimingPattern();

    matrix.addFormatInformation(matrix.merge([analyzer.getFormatData(),
      correction.formatError(analyzer.getFormatData())]));
    
    matrix.addVersionInformation(analyzer.getVersion(),
      matrix.merge([analyzer.getVersionData(),
        correction.versionError(analyzer.getVersionData())]));
    
    matrix.addData(matrix.merge([matrix.interleave(analyzer.getBlocks()),
      matrix.interleave(correction.getErrorBlocks())]));
    
    analyzer.setMaskPattern(matrix.applyMask());
    
    matrix.addFormatInformation(matrix.merge([analyzer.getFormatData(),
      correction.formatError(analyzer.getFormatData())]));

    let light: Color = {
      red: 255,
      blue: 255,
      green: 255,
      alpha: 255
    };

    let dark: Color = {
      red: 0,
      blue: 0,
      green: 0,
      alpha: 255
    };

    let map = matrix.generateRGBAMap(light, dark);

    let context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
      this.canvas.nativeElement.height = matrix.imageSize();
      this.canvas.nativeElement.width = matrix.imageSize();
      let image = context.createImageData(matrix.imageSize(), matrix.imageSize());

      let data = image.data;
      data.set(map, 0);

      let newImage = new ImageData(data, matrix.imageSize(), matrix.imageSize());
      context.putImageData(newImage, 0, 0);
    }
  }
}
