import { AfterViewInit, Component, ElementRef, Input, ViewChild } from '@angular/core';

import { Markers } from './utils/markers';
import { Analyzer } from './utils/analyzer';
import { ErrorCorrection } from './utils/error';
import { hexToColor, Matrix } from './utils/matrix';
import { ERROR_CORRECTION_LEVEL, FORMAT_ERROR_LENGTH, FORMAT_GOLAY } from './utils/constants';
import { QUIET_ZONE_SIZE, VERSION, VERSION_ERROR_LENGTH, VERSION_GOLAY } from './utils/constants';
import { identifierLevel } from './utils/tables';

@Component({
  selector: 'ngx-quick-response-code',
  template: `<canvas #code></canvas>`,
  styles: ``,
})
export class QuickResponseCode implements AfterViewInit {
  @Input() scale: number = 4;
  @Input() text: string = "NGX QUICK RESPONSE CODE";
  @Input() quietZoneSize: number = QUIET_ZONE_SIZE;
  @Input() minimumVersion: number = VERSION.MIN;
  @Input() minimumErrorLevel: string = ERROR_CORRECTION_LEVEL.L;
  @Input() lightColor: string = "#FFFFFFFF";
  @Input() darkColor: string = "#000000FF";

  @ViewChild('code', {static: false}) canvas!: ElementRef<HTMLCanvasElement>;

  constructor() {}

  private draw(context: CanvasRenderingContext2D): void {
    // Readability over optimization.
    // TODO: optimize while maintaining readability.
    let analyzer: Analyzer = new Analyzer(this.text);
    analyzer.setMinimumVersionAndLevel(this.minimumVersion,
      identifierLevel(this.minimumErrorLevel));

    let markers: Markers = new Markers(analyzer.getVersion());

    let correction: ErrorCorrection = new ErrorCorrection(
      analyzer.getVersion(), analyzer.getLevel(), analyzer.getBlocks());
    
    let matrix: Matrix = new Matrix(markers.size(),
      this.quietZoneSize, this.scale);

    markers.finderPatterns().forEach(center => {
      matrix.placeFinderPattern(center)
    });

    markers.alignmentPatterns().forEach(center => {
      matrix.placeAlignmentPattern(center);
    });

    matrix.addTimingPattern();

    matrix.addFormatInformation(matrix.merge([analyzer.getFormatData(),
      correction.getBinaryError(analyzer.getFormatData(),
        FORMAT_ERROR_LENGTH, FORMAT_GOLAY)]));
    
    matrix.addVersionInformation(analyzer.getVersion(),
      matrix.merge([analyzer.getVersionData(),
        correction.getBinaryError(analyzer.getVersionData(),
          VERSION_ERROR_LENGTH, VERSION_GOLAY)]));
    
    matrix.addData(matrix.merge([matrix.interleave(analyzer.getBlocks()),
      matrix.interleave(correction.getErrorBlocks())]));
    
    analyzer.setMaskPattern(matrix.applyOptimalMask(analyzer.getFormatDataForMaskPatterns(),
      correction.getFormatErrorsForMaskPatterns(analyzer.getFormatDataForMaskPatterns())));
    
    matrix.addFormatInformation(matrix.merge([analyzer.getFormatData(),
      correction.getBinaryError(analyzer.getFormatData(),
        FORMAT_ERROR_LENGTH, FORMAT_GOLAY)]));

    context.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    this.canvas.nativeElement.height = matrix.imageSize();
    this.canvas.nativeElement.width = matrix.imageSize();

    let data = context.createImageData(matrix.imageSize(), matrix.imageSize()).data;
    data.set(matrix.getScaledRGBAMap(hexToColor(this.lightColor),
      hexToColor(this.darkColor)), 0);

    let newImage = new ImageData(data,
      matrix.imageSize(), matrix.imageSize());
    context.putImageData(newImage, 0, 0);
  }

  ngAfterViewInit(): void {
    let context = this.canvas.nativeElement.getContext('2d');
    if (context) {
      this.draw(context);
    }
  }
}
