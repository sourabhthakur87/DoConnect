using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DoConnectBackend.Migrations
{
    /// <inheritdoc />
    public partial class MakeImageLinksOptional : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Answers_answerId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Questions_questionId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "questionId",
                table: "Images",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AlterColumn<int>(
                name: "answerId",
                table: "Images",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Answers_answerId",
                table: "Images",
                column: "answerId",
                principalTable: "Answers",
                principalColumn: "answerId");

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Questions_questionId",
                table: "Images",
                column: "questionId",
                principalTable: "Questions",
                principalColumn: "questionId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Images_Answers_answerId",
                table: "Images");

            migrationBuilder.DropForeignKey(
                name: "FK_Images_Questions_questionId",
                table: "Images");

            migrationBuilder.AlterColumn<int>(
                name: "questionId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AlterColumn<int>(
                name: "answerId",
                table: "Images",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Answers_answerId",
                table: "Images",
                column: "answerId",
                principalTable: "Answers",
                principalColumn: "answerId",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Images_Questions_questionId",
                table: "Images",
                column: "questionId",
                principalTable: "Questions",
                principalColumn: "questionId",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
